import * as xml2js from 'xml2js';
import { createWriteStream, WriteStream, promises as fsPromises } from 'fs';
import { basename, join as pathJoin } from 'path';
import { v4 as uuid4 } from 'uuid';
import { zipFiles } from '@symbiota2/api-common';
import { Logger } from '@nestjs/common';
import { PassThrough } from 'stream';
import { getKGProperty, isKGID, KGNode } from '../decorators';
import { IKGAMeta, IKGAMetaFileLocationType } from '../interfaces';

export class KnowledgeGraphBuilder {
    private static readonly DWC_FIELD_SEP = ',';
    private static readonly DWC_LINE_SEP = '\n';
    private static readonly DWC_FIELD_ENCLOSE = '"';
    private static readonly DWC_FIELD_ENCLOSE_REPLACE_REGEXP = new RegExp(
        KnowledgeGraphBuilder.DWC_FIELD_ENCLOSE
    );
    private static readonly DWC_LINE_SEP_REGEXP = new RegExp(
        KnowledgeGraphBuilder.DWC_LINE_SEP
    );

    private readonly logger = new Logger(KnowledgeGraphBuilder.name);
    private readonly tmpDir: string;
    private readonly fileMap: Map<string, WriteStream>;
    private readonly fieldMap: Map<string, Map<string, string>>;
    private readonly uniqueRecordMap: Map<string, Set<any>>;
    private readonly coreFileType: string;
    private coreIDField: string;
c
    constructor(coreClass: any, tmpDir: string) {
        this.tmpDir = tmpDir;
        this.fileMap = new Map<string, WriteStream>();
        this.fieldMap = new Map<string, Map<string, string>>();
        this.uniqueRecordMap = new Map<string, Set<any>>();
        this.coreIDField = '';
        //this.coreFileType = dwcRecordType(coreClass);

        //if (!this.coreFileType) {
        //    throw new Error(`Invalid DwC record type for class ${coreClass.name}`);
        //}
    }

    private orderedDwcFields(recordType: string): string[] {
        return [...this.fieldMap.get(recordType).keys()].sort();
    }

    private orderedRecordFields(recordType: string): string[] {
        return this.orderedDwcFields(recordType).map((k) => {
            return this.fieldMap.get(recordType).get(k)
        });
    }

    private async recordToCSVLine(recordType: string, record: Record<any, any>): Promise<string> {
        const fields = [];
        for (const field of this.orderedRecordFields(recordType)) {
            let csvField = KnowledgeGraphBuilder.DWC_FIELD_ENCLOSE;
            let val = record[field];

            if (typeof val === 'function') {
                val = await val.bind(record)();
            }

            if (val) {
                csvField += val.toString()
                    .replace(
                        KnowledgeGraphBuilder.DWC_FIELD_ENCLOSE_REPLACE_REGEXP,
                        `\\${ KnowledgeGraphBuilder.DWC_FIELD_ENCLOSE }`
                    )
                    .replace(
                        KnowledgeGraphBuilder.DWC_LINE_SEP_REGEXP,
                        `\\${ KnowledgeGraphBuilder.DWC_LINE_SEP }`
                    )
            }
            csvField += KnowledgeGraphBuilder.DWC_FIELD_ENCLOSE;
            fields.push(csvField);
        }
        let line = fields.join(KnowledgeGraphBuilder.DWC_FIELD_SEP);
        line += KnowledgeGraphBuilder.DWC_LINE_SEP;
        return line;
    }

    private csvHeaderLine(recordType: string): string {
        const fields = [];
        for (const field of this.orderedRecordFields(recordType)) {
            let csvField = KnowledgeGraphBuilder.DWC_FIELD_ENCLOSE;
            csvField += field.replace(
                KnowledgeGraphBuilder.DWC_FIELD_ENCLOSE_REPLACE_REGEXP,
                `\\${ KnowledgeGraphBuilder.DWC_FIELD_ENCLOSE }`
            );
            csvField += KnowledgeGraphBuilder.DWC_FIELD_ENCLOSE;
            fields.push(csvField);
        }
        let line = fields.join(KnowledgeGraphBuilder.DWC_FIELD_SEP);
        line += KnowledgeGraphBuilder.DWC_LINE_SEP;
        return line;
    }

    async addRecord(record: any): Promise<void> {
        const recordType = KGNode([], record.constructor)["url"];
        let recordID;

        if (!recordType) {
            this.logger.warn(`Invalid knowledge graph record type for class ${record.constructor.name}`);
            return;
        }

        // Map dwcUrl --> recordField
        if (!this.fieldMap.has(recordType)) {
            const recordFieldMap = new Map<string, string>();
            const allRecordFields = [
                // This gets the properties
                ...Object.getOwnPropertyNames(record),
                // This gets the methods
                ...Object.getOwnPropertyNames(record.constructor.prototype)
            ];

            for (const recordFieldName of allRecordFields) {
                const dwcUrl = getKGProperty(record.constructor, recordFieldName);
                if (!dwcUrl) {
                    continue;
                }

                recordFieldMap.set(dwcUrl, recordFieldName);

                if (isKGID(record, recordFieldName) && recordType === this.coreFileType) {
                    this.coreIDField = dwcUrl;
                }
            }
            this.fieldMap.set(recordType, recordFieldMap);
        }

        // Look up the dwc record id
        for (const recordField of Object.keys(record)) {
            if (isKGID(record.constructor, recordField)) {
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
            return;
        }

        if (this.uniqueRecordMap.get(recordType).has(recordID)) {
            // this.logger.warn(`Duplicate ${record.constructor.name} detected: '${recordID}'`);
            return;
        }

        this.uniqueRecordMap.get(recordType).add(recordID);

        // Map dwcRecordType --> writeStream
        if (!this.fileMap.has(recordType)) {
            const filePath = pathJoin(this.tmpDir, `${ encodeURIComponent(record.constructor.name) }.csv`);
            const csvStream = createWriteStream(filePath);
            csvStream.write(this.csvHeaderLine(recordType));
            this.fileMap.set(recordType, csvStream);
        }

        const fileStream = this.fileMap.get(recordType);
        const csvLine = await this.recordToCSVLine(recordType, record);
        await new Promise<void>((resolve) => {
            const keepWriting = fileStream.write(csvLine);
            if (keepWriting) {
                resolve();
            }
            else {
                fileStream.once('drain', () => resolve());
            }
        })

        return;
    }

    async build(archivePath: string) {
        const commonOpts = {
            fieldsTerminatedBy: KnowledgeGraphBuilder.DWC_FIELD_SEP,
            linesTerminatedBy: KnowledgeGraphBuilder.DWC_LINE_SEP,
            fieldsEnclosedBy: KnowledgeGraphBuilder.DWC_FIELD_ENCLOSE,
            ignoreHeaderLines: 1,
            encoding: "UTF-8"
        };

        const meta: IKGAMeta = {
            archive: {
                $: {
                    xmlns: "xml:", //KnowledgeGraphBuilder.DWC_XML_NS,
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "xmlns:xs": "http://www.w3.org/2001/XMLSchema",
                    "xsi:schemaLocation": "xml:" //KnowledgeGraphBuilder.DWC_SCHEMA_LOCATION
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
        }

        const csvFiles = [];
        for (const [recordType, fileStream] of this.fileMap.entries()) {
            await new Promise<void>((resolve) => {
                fileStream.on('finish', () => resolve());
                fileStream.end();
            });

            let fileArr: IKGAMetaFileLocationType[];
            if (recordType === this.coreFileType) {
                fileArr = meta.archive.core.files;
            }
            else {
                const extensionIdx = meta.archive.extension.findIndex((e) => {
                    return e.$.rowType === recordType
                });
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
