import {
    DWC_SCHEMA_LOCATION,
    DWC_XML_NS,
    IDwCAMeta,
    IDwCAMetaExtensionFileType,
    IDwCAMetaFieldType,
    IDwCAMetaFileLocationType, IDwCAMetaFileType
} from '../interfaces';
import * as xml2js from 'xml2js';
import { createWriteStream, WriteStream, promises as fsPromises } from 'fs';
import { basename, join as pathJoin } from 'path';
import { v4 as uuid4 } from 'uuid';
import { zipFiles } from '@symbiota2/api-common';
import { dwcField, dwcRecordType, isDwCID } from '../decorators';
import { Logger } from '@nestjs/common';
import { core } from '@angular/compiler';

export class DwcArchiveBuilder {
    private static readonly DWC_FIELD_SEP = ',';
    private static readonly DWC_LINE_SEP = '\n';
    private static readonly DWC_FIELD_ENCLOSE = '"';
    private static readonly DWC_FIELD_ENCLOSE_REPLACE_REGEXP = new RegExp(
        DwcArchiveBuilder.DWC_FIELD_ENCLOSE
    );
    private static readonly DWC_LINE_SEP_REGEXP = new RegExp(
        DwcArchiveBuilder.DWC_LINE_SEP
    );

    private readonly logger = new Logger(DwcArchiveBuilder.name);
    private readonly tmpDir: string;
    private readonly fileMap: Map<string, WriteStream>;
    private readonly fieldMap: Map<string, Map<string, string>>;
    private readonly uniqueRecordMap: Map<string, Set<any>>;
    private readonly coreFileType: string;
    private coreIDField: string;

    constructor(coreClass: any, tmpDir: string) {
        this.tmpDir = tmpDir;
        this.fileMap = new Map<string, WriteStream>();
        this.fieldMap = new Map<string, Map<string, string>>();
        this.uniqueRecordMap = new Map<string, Set<any>>();
        this.coreIDField = '';
        this.coreFileType = dwcRecordType(coreClass);

        if (!this.coreFileType) {
            throw new Error(`Invalid DwC record type for class ${coreClass.name}`);
        }
    }

    private orderedDwcFields(recordType: string): string[] {
        return [...this.fieldMap.get(recordType).keys()].sort();
    }

    private orderedRecordFields(recordType: string): string[] {
        return this.orderedDwcFields(recordType).map((k) => {
            return this.fieldMap.get(recordType).get(k)
        });
    }

    private recordToCSVLine(recordType: string, record: Record<any, any>): string {
        const fields = [];
        for (const field of this.orderedRecordFields(recordType)) {
            let csvField = DwcArchiveBuilder.DWC_FIELD_ENCLOSE;
            if (Object.keys(record).includes(field)) {
                const val = record[field];
                if (val) {
                    csvField += val.toString()
                        .replace(
                            DwcArchiveBuilder.DWC_FIELD_ENCLOSE_REPLACE_REGEXP,
                            `\\${ DwcArchiveBuilder.DWC_FIELD_ENCLOSE }`
                        )
                        .replace(
                            DwcArchiveBuilder.DWC_LINE_SEP_REGEXP,
                            `\\${ DwcArchiveBuilder.DWC_LINE_SEP }`
                        )
                }
            }
            csvField += DwcArchiveBuilder.DWC_FIELD_ENCLOSE;
            fields.push(csvField);
        }
        let line = fields.join(DwcArchiveBuilder.DWC_FIELD_SEP);
        line += DwcArchiveBuilder.DWC_LINE_SEP;
        return line;
    }

    private csvHeaderLine(recordType: string): string {
        const fields = [];
        for (const field of this.orderedRecordFields(recordType)) {
            let csvField = DwcArchiveBuilder.DWC_FIELD_ENCLOSE;
            csvField += field.replace(
                DwcArchiveBuilder.DWC_FIELD_ENCLOSE_REPLACE_REGEXP,
                `\\${ DwcArchiveBuilder.DWC_FIELD_ENCLOSE }`
            );
            csvField += DwcArchiveBuilder.DWC_FIELD_ENCLOSE;
            fields.push(csvField);
        }
        let line = fields.join(DwcArchiveBuilder.DWC_FIELD_SEP);
        line += DwcArchiveBuilder.DWC_LINE_SEP;
        return line;
    }

    addRecord(record: any): DwcArchiveBuilder {
        const recordType = dwcRecordType(record.constructor);
        let recordID;

        if (!recordType) {
            this.logger.warn(`Invalid DwC record type for class ${record.constructor.name}`);
            return this;
        }

        // Map dwcUrl --> recordField
        if (!this.fieldMap.has(recordType)) {
            const recordFieldMap = new Map<string, string>();
            for (const recordField of Object.keys(record)) {
                const dwcUrl = dwcField(record, recordField);
                if (dwcUrl) {
                    recordFieldMap.set(dwcUrl, recordField);
                }
                if (isDwCID(record, recordField) && recordType === this.coreFileType) {
                    this.coreIDField = dwcUrl;
                }
            }
            this.fieldMap.set(recordType, recordFieldMap);
        }

        // Look up the dwc record id
        for (const recordField of Object.keys(record)) {
            if (isDwCID(record, recordField)) {
                recordID = record[recordField];
            }
        }

        // Check that we have an ID and it's not a duplicate
        // Make sure we don't include any duplicates
        if (!this.uniqueRecordMap.has(recordType)) {
            this.uniqueRecordMap.set(recordType, new Set<any>());
        }

        if (!recordID) {
            this.logger.warn(`Invalid DwC ID for class ${record.constructor.name}`);
            return this;
        }

        if (this.uniqueRecordMap.get(recordType).has(recordID)) {
            // this.logger.warn(`Duplicate ${record.constructor.name} detected: '${recordID}'`);
            return this;
        }

        this.uniqueRecordMap.get(recordType).add(recordID);

        // Map dwcRecordType --> writeStream
        if (!this.fileMap.has(recordType)) {
            const filePath = pathJoin(this.tmpDir, `${ uuid4() }.csv`);
            const csvStream = createWriteStream(filePath);
            csvStream.write(this.csvHeaderLine(recordType));
            this.fileMap.set(recordType, csvStream);
        }

        const fileStream = this.fileMap.get(recordType);
        const csvLine = this.recordToCSVLine(recordType, record);
        fileStream.write(csvLine);

        return this;
    }

    async build(archivePath: string) {
        const commonOpts = {
            fieldsTerminatedBy: DwcArchiveBuilder.DWC_FIELD_SEP,
            linesTerminatedBy: DwcArchiveBuilder.DWC_LINE_SEP,
            fieldsEnclosedBy: DwcArchiveBuilder.DWC_FIELD_ENCLOSE,
            ignoreHeaderLines: 1,
            encoding: "UTF-8"
        };

        const meta: IDwCAMeta = {
            archive: {
                $: {
                    xmlns: DWC_XML_NS,
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "xmlns:xs": "http://www.w3.org/2001/XMLSchema",
                    "xsi:schemaLocation": DWC_SCHEMA_LOCATION
                },
                core: {
                    $: {
                        rowType: this.coreFileType as any,
                        ...commonOpts
                    },
                    files: [],
                    id: { $: { index: -1 } },
                    field: [],
                },
                extension: []
            }
        }

        for (const recordType of this.fileMap.keys()) {
            if (recordType === this.coreFileType) {
                const coreFields = this.orderedDwcFields(this.coreFileType);
                for (let fieldIdx = 0; fieldIdx < coreFields.length; fieldIdx++) {
                    const field = coreFields[fieldIdx];
                    meta.archive.core.field.push({
                        $: { index: fieldIdx, term: field }
                    });
                    if (field === this.coreIDField) {
                        meta.archive.core.id.$.index = fieldIdx;
                    }
                }
            }
            else {
                const extension = {
                    $: {
                        rowType: recordType as any,
                        ...commonOpts
                    },
                    files: [],
                    coreid: { $: { index: -1 } },
                    field: [],
                }

                const extensionFields = this.orderedDwcFields(recordType);
                for (let fieldIdx = 0; fieldIdx < extensionFields.length; fieldIdx++) {
                    const field = extensionFields[fieldIdx];
                    if (field === this.coreIDField) {
                        extension.coreid.$.index = fieldIdx;
                    }
                    extension.field.push({
                        $: { index: fieldIdx, term: field }
                    });
                }

                meta.archive.extension.push(extension);
            }
        }

        const csvFiles = [];
        for (const [recordType, fileStream] of this.fileMap.entries()) {
            fileStream.end();

            let fileArr: IDwCAMetaFileLocationType[];
            if (recordType === this.coreFileType) {
                fileArr = meta.archive.core.files;
            }
            else {
                const extensionIdx = meta.archive.extension.findIndex((e) => e.$.rowType === recordType);
                fileArr = meta.archive.extension[extensionIdx].files;
            }

            const targetFile = fileStream.path.toString();
            csvFiles.push(targetFile);
            fileArr.push({ location: [basename(targetFile)] });
        }

        const metaPath = pathJoin(this.tmpDir, 'meta.xml');

        const xmlBuilder = new xml2js.Builder();
        const metaXML = xmlBuilder.buildObject(meta);

        await fsPromises.writeFile(metaPath, metaXML);
        await zipFiles(archivePath, [metaPath, ...csvFiles]);
    }
}
