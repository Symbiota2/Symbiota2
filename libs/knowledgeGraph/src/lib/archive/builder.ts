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

    async addEntity(input,
                    factory,
                    name: string,
                    url: string,
                    keys: string[],
                    propertiesMap: Map<string,string>,
                    edgesMap: Map<string, KGEdgeType>,
                    record: any): Promise<void> {

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
            // First form the key
            const edgeKeyValues = []
            const name = "__" + edge + "__"
            const records = record[name]
            for (let i = 0; i < records.length; i++) {
                for (let k = 0; k < edgeType.keys.length; k++) {
                    edgeKeyValues.push(records[i][edgeType.keys[k]["propertyName"]])
                }

                // Generate the ID string
                const edgeID = edgeKeyValues.join(KnowledgeGraphBuilder.KG_KEY_SEPARATOR)
                const edgeUrl = KnowledgeGraphBuilder.KG_RDF_HOST + '/' + edgeType.name + '#' + edgeID

                // Add a quad for the node
                input.push(factory.quad(
                    factory.namedNode( myUrl ),
                    factory.namedNode(edgeType.url),
                    factory.namedNode( edgeUrl)))
            }

        }

        return;
    }

    async build(archivePath: string) {

        //const metaPath = pathJoin(this.tmpDir, 'meta.xml');

        //const metaXML = ""

        //await fsPromises.writeFile(metaPath, metaXML);
        //await zipFiles(archivePath, [metaPath, ...csvFiles]);
    }


}
