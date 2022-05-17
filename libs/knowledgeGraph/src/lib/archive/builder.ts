import * as xml2js from 'xml2js';
import { createWriteStream, WriteStream, promises as fsPromises } from 'fs';
import { basename, join as pathJoin } from 'path';
import { v4 as uuid4 } from 'uuid';
import { zipFiles } from '@symbiota2/api-common';
import { Logger } from '@nestjs/common';
import { PassThrough, Readable } from 'stream';
import { getKGProperty, isKGID, KGNode } from '../decorators';
import { IKGAMeta, IKGAMetaFileLocationType } from '../interfaces';
import { DataFactory } from 'rdf-data-factory';
import { KGEdgeType } from '@symbiota2/api-knowledge-graph';

export class KnowledgeGraphBuilder {
    private static readonly KG_KEY_SEPARATOR = '.'
    private readonly graphName: string;
    private static readonly KG_RDF_HOST = 'http://localhost/rdf'

    private readonly logger = new Logger(KnowledgeGraphBuilder.name);
    private readonly tmpDir: string;

    constructor(graphName: string, tmpDir?: string) {
        this.tmpDir = tmpDir
        this.graphName = graphName
    }

    async addEntity(name: string, url: string, keys: string[], propertiesMap: Map<string,string>, edgesMap: Map<string, KGEdgeType>, record: any): Promise<void> {
        const factory = new DataFactory()
        const SerializerJsonld = require('@rdfjs/serializer-jsonld')
        const serializerJsonld = new SerializerJsonld()

        const input = new Readable({
            objectMode: true,
            read: () => {
            }
        })

        /*
        const allRecordFields = [
            // This gets the properties
            ...Object.getOwnPropertyNames(record),
            // This gets the methods
            // ...Object.getOwnPropertyNames(record.constructor.prototype)
        ]
         */

        // First form the key
        const keyValues = []
        for (const keyField of keys) {
            keyValues.push(record[keyField])
        }

        // Generate the ID string
        const myID = keyValues.join(KnowledgeGraphBuilder.KG_KEY_SEPARATOR)
        const myUrl = KnowledgeGraphBuilder.KG_RDF_HOST + '/' + name + '#' + myID

        // Add a quad for the node
        input.push(factory.quad(
            factory.namedNode( myUrl ),
            factory.namedNode('rdf:type'),
            factory.namedNode(url)))

        // Add quads for the properties
        for (let [property, url] of propertiesMap) {
            input.push(factory.quad(
                factory.namedNode( myUrl ),
                factory.namedNode(url),
                factory.literal(record[property])))
        }

        // Add quads for the edges
        for (let [edge, edgeType] of edgesMap) {

            for (let i = 0; i < edgeType.keys.length; i++) {

            }
            /*
            const edgeName =
            input.push(factory.quad(
                factory.namedNode( myUrl ),
                factory.namedNode(url),
                factory.literal(record[property])))

             */
        }

        const output = serializerJsonld.import(input)

        output.on('data', jsonld => {
            console.log(jsonld)
        })

        input.push(null)

        /*
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

         */

        return;
    }

    async build(archivePath: string) {

        const metaPath = pathJoin(this.tmpDir, 'meta.xml');

        const metaXML = ""

        await fsPromises.writeFile(metaPath, metaXML);
        //await zipFiles(archivePath, [metaPath, ...csvFiles]);
    }


}
