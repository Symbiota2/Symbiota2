import {
    DWC_SCHEMA_LOCATION,
    DWC_XML_NS,
    IDwCAMeta,
    IDwCAMetaExtensionFileType,
    IDwCAMetaFieldType,
    IDwCAMetaFileLocationType,
    IDwCASerializable
} from '../interfaces';
import * as xml2js from 'xml2js';
import { createWriteStream, WriteStream, promises as fsPromises } from 'fs';
import { basename, join as pathJoin } from 'path';
import { v4 as uuid4 } from 'uuid';
import { zipFiles } from '@symbiota2/api-common';

export class DwcArchiveBuilder {
    private static readonly DWC_FIELD_PREFIX = 'http://rs.tdwg.org/dwc/terms';
    private static readonly DWC_FIELD_SEP = ',';
    private static readonly DWC_LINE_SEP = '\n';
    private static readonly DWC_FIELD_ENCLOSE = '"';
    private static readonly DWC_FIELD_ENCLOSE_REPLACE_REGEXP = new RegExp(
        DwcArchiveBuilder.DWC_FIELD_ENCLOSE
    );

    private csvCoreFile: WriteStream;

    tmpDir: string;
    meta: IDwCAMeta;

    constructor(tmpDir: string, coreRowType: 'Occurrence' | 'Taxon') {
        this.tmpDir = tmpDir;
        this.meta = {
            archive: {
                $: {
                    xmlns: DWC_XML_NS,
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "xsi:schemaLocation": DWC_SCHEMA_LOCATION
                },
                core: {
                    $: {
                        rowType: `${DwcArchiveBuilder.DWC_FIELD_PREFIX}/${coreRowType}` as any,
                        fieldsTerminatedBy: DwcArchiveBuilder.DWC_FIELD_SEP,
                        linesTerminatedBy: DwcArchiveBuilder.DWC_LINE_SEP,
                        fieldsEnclosedBy: DwcArchiveBuilder.DWC_FIELD_ENCLOSE,
                        encoding: "UTF-8"
                    },
                    files: new Array<IDwCAMetaFileLocationType>(),
                    field: new Array<IDwCAMetaFieldType>()
                },
                extension: new Array<IDwCAMetaExtensionFileType>()
            }
        }

        this.csvCoreFile = createWriteStream(pathJoin(tmpDir, `${uuid4()}.csv`));
    }

    private get coreFields(): string[] {
        return this.meta.archive.core.field
            .map((fieldDesc) => {
                return fieldDesc.$.term.
                    replace(`${DwcArchiveBuilder.DWC_FIELD_PREFIX}/`, '')
            });
    }

    private get coreFiles(): string[] {
        const fileList = [];
        for (const locationList of this.meta.archive.core.files.map((fieldDesc) => fieldDesc.location)) {
            fileList.push(...locationList);
        }
        return fileList;
    }

    private recordToCSVLine(dwcRecord: Record<any, any>): string {
        let line = '';
        for (const field of this.coreFields) {
            line += DwcArchiveBuilder.DWC_FIELD_ENCLOSE;
            if (Object.keys(dwcRecord).includes(field)) {
                const val = dwcRecord[field];
                if (val) {
                    line += val.toString().replace(
                        DwcArchiveBuilder.DWC_FIELD_ENCLOSE_REPLACE_REGEXP,
                        `\\${ DwcArchiveBuilder.DWC_FIELD_ENCLOSE }`
                    )
                }
            }
            line += DwcArchiveBuilder.DWC_FIELD_ENCLOSE;
            line += DwcArchiveBuilder.DWC_FIELD_SEP;
        }
        line += DwcArchiveBuilder.DWC_LINE_SEP;
        return line;
    }

    addCoreRecord(serializable: IDwCASerializable): DwcArchiveBuilder {
        const asRecord = serializable.asDwCRecord();

        if (this.coreFields.length === 0) {
            const fields = Object.keys(asRecord);

            for (let i = 0; i < fields.length; i++) {
                let term = fields[i];

                // This is lame
                if (term === 'modified') {
                    term = 'http://purl.org/dc/terms/modified';
                }
                else {
                    term = `${DwcArchiveBuilder.DWC_FIELD_PREFIX}/${fields[i]}`;
                }
                const fieldDesc: IDwCAMetaFieldType = {
                    $: {
                        term: term,
                        index: i
                    }
                };
                this.meta.archive.core.field.push(fieldDesc);
            }
        }

        const csvLine = this.recordToCSVLine(asRecord);
        this.csvCoreFile.write(csvLine);
        return this;
    }

    setCoreID(idFieldName: string): DwcArchiveBuilder {
        if (this.coreFields.includes(idFieldName)) {
            this.meta.archive.core.id = {
                $: {
                    index: this.coreFields.indexOf(idFieldName)
                }
            };
        }
        else {
            throw new Error(`Unknown core id field '${idFieldName}'`)
        }
        return this;
    }

    async build(archivePath: string) {
        const metaPath = pathJoin(this.tmpDir, 'meta.xml');

        this.csvCoreFile.end();
        this.meta.archive.core.files.push({
            location: [basename(this.csvCoreFile.path.toString())]
        });

        const xmlBuilder = new xml2js.Builder();
        const meta = xmlBuilder.buildObject(this.meta);

        await fsPromises.writeFile(metaPath, meta);
        await zipFiles(archivePath, [metaPath, this.csvCoreFile.path.toString()]);
    }
}
