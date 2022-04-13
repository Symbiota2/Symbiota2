import zipExtract from 'extract-zip';
import { tmpdir } from 'os';
import path from 'path';
import {
    IDwCAMeta,
    IDwCAMetaFieldType, DWC_XML_NS
} from '../interfaces';
import { readXmlFile } from '@symbiota2/api-common';
import csv from 'csv-parser';
import { createReadStream, mkdtempSync } from 'fs';
import { rm } from 'fs/promises';

/**
 * Parse a DwC Archive file & return Taxon entities
 * Archives are zip files composed of a meta.xml with metadata & csv files with actual data
 * See https://dwc.tdwg.org/text/ for more
 */
export class DwCArchiveParser {

    /**
     * @param filepath The path to the dwc archive
     * @param dwcType The type of dwc class to parse the archive for. 
     * See "rowType" in https://dwc.tdwg.org/text/. To transform a dwc class into a database
     * entity, use a static member DWC_TYPE on the entity class.
     */
    static async *read(filepath: string, dwcType: string) {
        // TODO: App config temp dir?
        const tempdir = mkdtempSync(`${tmpdir()}${path.sep}`);
        const meta = await DwCArchiveParser.parseMeta(filepath, tempdir);

        // Target stores the "core" section of meta.xml that corresponds to the dwcType
        let target = null;
        if (meta.archive.core.$.rowType === dwcType) {
            target = meta.archive.core;
        }
        else {
            for (const extension of meta.archive.extension) {
                if (extension.$.rowType == dwcType) {
                    target = extension;
                    break;
                }
            }
        }

        if (target === null) {
            throw new Error(`'${dwcType}' not found in ${filepath}!`);
        }

        // Get an ordered array of fields from meta.xml
        const fields = DwCArchiveParser.parseFields(target.field);

        // Extract the location (path) of data files for dwcType from meta.xml
        // See the <files> element in https://dwc.tdwg.org/text/
        const coreFiles = target.files.reduce((fileList, currentFiles) => {
            return [
                ...fileList,
                ...currentFiles.location.map((l) => path.join(tempdir, l))
            ];
        }, []);

        /// NOTE Use csv-parser to read each row of each data csv and yield it as an iterator,
        // Returned rows are an object with the following format:
        // {
        //   "dwc_uri": "value",
        //   "dwc_uri": "value",
        //   ...
        // }
        // Where dwc_uri is the identifier (uri) of a term defined in the dwc 
        // text spec (https://dwc.tdwg.org/terms/), and value is the value of that term for the
        // current row
        for (const file of coreFiles) {
            const stream = createReadStream(file).pipe(
                csv({
                    headers: fields,
                    skipLines: target.$.ignoreHeaderLines,
                    separator: target.$.fieldsTerminatedBy.replace('\\t', '\t'),
                    quote: target.$.fieldsEnclosedBy,
                })
            );
            for await (const row of stream) {
                yield row;
            }
        }

        // Cleanup
        await rm(tempdir, { recursive: true });
    }

    /**
     * Sort the fields in an array of IDwCAMetaFieldTypes by their index attribute.
     * See the "<field>" element in https://dwc.tdwg.org/text/
     * @param fields A list of <field> elements read from a dwc meta.xml
     */
    private static parseFields(fields: IDwCAMetaFieldType[]) {
        return fields.sort((a, b) => a.$.index - b.$.index).map((f) => f.$.term);
    }

    /**
     * @param archiveFilePath The path to the darwin core archive
     * @param tempdir A temporary directory to extract meta.xml to
     * @returns An object containing the archive metadata
     */
    private static async parseMeta(archiveFilePath: string, tempdir: string): Promise<IDwCAMeta> {

        await zipExtract(archiveFilePath, { dir: tempdir });
        const archiveMeta = await readXmlFile<IDwCAMeta>(
            path.join(tempdir, 'meta.xml')
        );

        // XML readXmlFile parses the core section as an array
        if (Array.isArray(archiveMeta.archive.core)) {
            archiveMeta.archive.core = archiveMeta.archive.core[0];
        }

        if (!archiveMeta.archive.$['xmlns'].includes(DWC_XML_NS)) {
            throw new Error(`Invalid DwC Archive. The supported namespace is ${DWC_XML_NS}`);
        }

        return archiveMeta;
    }
}

