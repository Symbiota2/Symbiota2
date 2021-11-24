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
//import { rm } from 'fs/promises';

export class DwCArchiveParser {
    static async *read(filepath: string, dwcType: string) {
        // TODO: App config data dir?
        const tempdir = mkdtempSync(`${tmpdir()}${path.sep}`);
        const meta = await DwCArchiveParser.parseMeta(filepath, tempdir);

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

        const fields = DwCArchiveParser.parseFields(target.field);
        const coreFiles = target.files.reduce((fileList, currentFiles) => {
            return [
                ...fileList,
                ...currentFiles.location.map((l) => path.join(tempdir, l))
            ];
        }, []);

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

        //await rm(tempdir, { recursive: true });
    }

    private static parseFields(fields: IDwCAMetaFieldType[]) {
        return fields.sort((a, b) => a.$.index - b.$.index).map((f) => f.$.term);
    }

    private static async parseMeta(archiveFilePath: string, tempdir: string) {

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

