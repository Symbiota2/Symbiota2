import { Inject, Injectable, Logger } from '@nestjs/common';
import { S3Object, StorageService } from '@symbiota2/api-storage';
import {
    EntityMetadata,
    EntityTarget,
    FindManyOptions,
    getConnection, IsNull,
    Repository
} from 'typeorm';
import { withTempDir } from '@symbiota2/api-common';
import { AppConfigService } from '@symbiota2/api-config';
import { join as pathJoin } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { Collection, Occurrence } from '@symbiota2/api-database';
import ReadableStream = NodeJS.ReadableStream;
import { getKGNode, getKGProperty, getKGEdge, KnowledgeGraphBuilder, KGPropertyType } from '@symbiota2/knowledgeGraph';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { DataFactory } from 'rdf-data-factory';
import { Readable } from 'stream';
import { KnowledgeGraph } from './dto/knowledge-graph';
// import { RDF } from '@rdfjs/data-model';
// import { SerializerJsonLD } from '@rdfjs/serializer-jsonld'
// import { DataFactory } from 'rdf-data-factory'
// import { Readable } from 'stream'

interface CreateGraphOpts {
    publish?: boolean;
}

/**
 * KG edge type
 */
export interface KGEdgeType {
    url: string
    name: string
    keys: string[]
}

/**
 * KG node structure
 */
interface KGGraphNode {
    url: string
    meta: EntityMetadata
    edges: Map<string,KGEdgeType>
    properties: Map<string,string>
    keys: string[]
}

@Injectable()
export class KnowledgeGraphService {
    private static readonly S3_PREFIX = 'kg';
    private static readonly DB_LIMIT = 1024;
    private static readonly DEFAULT_CREATE_ARCHIVE_OPTS: CreateGraphOpts = {
        publish: false
    };
    // private static readonly REGEX_SPACE_REPLACE = new RegExp(/\s/g)
    private readonly logger = new Logger(KnowledgeGraphService.name)

    constructor(
        private readonly appConfig: AppConfigService,
        private readonly storage: StorageService) { }

    private static s3Key(objectName: string): string {
        return [KnowledgeGraphService.S3_PREFIX, objectName].join('/');
    }

    // TODO: Redact sensitive localities
    private async createGraph(
        graphName: string,
        nodeMap: Map<string,KGGraphNode>,
        objectTags = {}
    ) {
        const db = getConnection()
        const dataDir = await this.appConfig.dataDir()
        const uploadPath = KnowledgeGraphService.s3Key(graphName)
        const kgBuilder = new KnowledgeGraphBuilder(graphName)
        const factory = new DataFactory()
        const SerializerJsonld = require('@rdfjs/serializer-jsonld')
        const serializerJsonld = new SerializerJsonld()

        const input = new Readable({
            objectMode: true,
            read: () => {
            }
        })

        return new Promise<void>((resolve, reject) => {
            withTempDir(dataDir, async (tmpDir) => {
                try {

                    const graphPath = pathJoin(tmpDir, graphName)
                    const writeStream = createWriteStream(graphPath)
                    const output = serializerJsonld.import(input)

                    writeStream.on('error', (err) => {
                        console.log("Writestream error " + err);
                    });

                    output.on('data', jsonld => {
                        writeStream.write(JSON.stringify(jsonld))
                        //console.log(jsonld)
                    })

                    output.on('end', () => {
                        writeStream.close()
                    })

                    // Let's process each kind of node
                    for (let [key, value] of nodeMap) {

                        // get the repository
                        const repo = db.getRepository(value.meta.target)
                        let offset = 0
                        const edges = []

                        for (let edge of value.edges.keys()) {
                            edges.push(edge)
                        }

                        let entities = await repo.find({
                            //...findOpts,
                            relations: edges,
                            take: KnowledgeGraphService.DB_LIMIT,
                            skip: offset
                        });

                        while (entities.length > 0) {
                            await Promise.all(entities.map((o) => kgBuilder
                                .addEntity(
                                    input,
                                    factory,
                                    value.meta.targetName,
                                    value.url,
                                    value.keys,
                                    value.properties,
                                    value.edges,
                                    o)));
                            offset += entities.length;

                            entities = await repo.find({
                                // ...findOpts,
                                relations: edges,
                                take: KnowledgeGraphService.DB_LIMIT,
                                skip: offset
                            });
                        }
                    }

                    input.emit("end")
                    await this.storage.putObject(uploadPath, createReadStream(graphPath), objectTags);
                    resolve()

                } catch (e) {
                    this.logger.log("Error building graph " + graphName + " error is " + e)
                    reject(e)
                }
            })
        })

    }

    async createKnowledgeGraph(graphName: string, opts = KnowledgeGraphService.DEFAULT_CREATE_ARCHIVE_OPTS): Promise<string> {
        // Map of graph nodes
        const nodeMap : Map<string,KGGraphNode> = new Map()

        // Get its tags
        const tags = {
            graphName: graphName,
            public: opts.publish.toString()
        }

        // Look at the metadata to build up a list of nodes, edges, and properties to process
        const db = getConnection()
        db.entityMetadatas.forEach((entityMeta) => {
            const nodeType = getKGNode(entityMeta.target)

            if (nodeType) {
                // This type has been decorated as a KG node
                // Get a list of its columns
                const columns : ColumnMetadata[] = entityMeta.columns

                // Process the object associated with the node type
                // Is the current graph in this type?
                let nodeValue = null
                for (let i = 0; i < nodeType.length; i++) {
                    if (nodeType[i].graph == graphName) {
                        // This node is in the graph being built
                        nodeValue = nodeType[i].url
                    }
                }

                // We can skip the rest if the node isn't in the graph
                if (nodeValue == null) {
                    return
                }

                // Set up the mapping
                const propertyMapValues = new Map<string, string>()
                const edgeMapValues = new Map<string, KGEdgeType>()
                const mapValue = {
                    url: nodeValue,
                    meta: entityMeta,
                    edges: edgeMapValues,
                    properties: propertyMapValues,
                    keys: []
                }
                nodeMap.set(entityMeta.targetName, mapValue)

                // Now let's deal with the properties
                const propertyMap = entityMeta.propertiesMap
                const ids = entityMeta.primaryColumns
                // console.log(" keys key is " + entityMeta.name)
                const resolvedKeys = []
                // Get the names of the columns for the primary key
                for (let key in ids) {
                    // console.log(" key " + propertyMap)
                    resolvedKeys.push(columns[key].propertyName)
                }
                mapValue.keys = resolvedKeys

                // Run through the properties
                for (let key in propertyMap) {
                    const propertyType = getKGProperty(entityMeta.target, key)
                    if (propertyType) {

                        // Let's check to see if property is in graph
                        let propertyUrl = null
                        for (let i = 0; i < propertyType.length; i++) {
                            if (propertyType[i].graph == graphName) {
                                propertyUrl = propertyType[i].url
                            }
                        }
                        if (propertyUrl != null) {
                            propertyMapValues.set(key,propertyUrl)
                        }
                    }
                }

                const linkMap = new Map();
                for (let index in entityMeta.relations) {
                    const relationMeta : RelationMetadata = entityMeta.relations[index]
                    linkMap.set(relationMeta.propertyName, relationMeta)
                }

                // process the edges
                for (let key in propertyMap) {
                    const edgeType = getKGEdge(entityMeta.target, key)
                    if (edgeType) {
                        // console.log(" Edge " + key)
                        let edgeUrl = null
                        for (const index in edgeType) {
                            // console.log("KG Edge " + index + " " + edgeType[index] + " ")
                            // Let's check to see if edge is in graph
                            if (edgeType[index].graph == graphName) {
                                edgeUrl = edgeType[index].url
                            }
                        }
                        if (edgeUrl != null) {
                            console.log("KG Edge setting " + key + " " + edgeUrl)
                            const relationMeta = linkMap.get(key)
                            edgeMapValues.set(key,
                                {
                                    url: edgeUrl,
                                    name: relationMeta.inverseEntityMetadata.target.name,
                                    keys: relationMeta.inverseEntityMetadata.primaryColumns
                                })
                        }
                    }
                }

            }
        })

        this.logger.log("Creating knowledge graph ")

        await this.createGraph(
            graphName,
            nodeMap,
            tags
        )

        return graphName;
    }

    async listGraphs(): Promise<KnowledgeGraph[]> {
        // Look at the metadata to build up a list of graph names
        const db = getConnection()
        const graphNames = []
        for (const entityMeta of db.entityMetadatas) {
            const nodeType = getKGNode(entityMeta.target)

            if (nodeType) {
                // This type has been decorated as a KG node

                // Process the object associated with the node type
                // Is the current graph in this type?
                let nodeValue = null
                const objs = await this.knowledgeGraphListObjects()
                const objMap = new Map<string, S3Object>()
                for (const obj of objs) {
                    objMap.set(obj.key, obj)
                }
                for (let i = 0; i < nodeType.length; i++) {
                    const name = nodeType[i].graph
                    const mapKey = KnowledgeGraphService.s3Key(name)
                    if (objMap.has(mapKey)) {
                        const obj = objMap.get(mapKey)
                        graphNames.push(new KnowledgeGraph({
                            name: name,
                            updatedAt: obj.updatedAt,
                            size: obj.size
                        }))
                    } else {
                        graphNames.push(new KnowledgeGraph({
                            name: name,
                            updatedAt: null,
                            size: null
                        }))
                    }
                }
            }
        }

        return graphNames
    }

    async knowledgeGraphExists(graphName: string): Promise<boolean> {
        return await this.storage.hasObject(KnowledgeGraphService.s3Key(graphName))
    }

    async knowledgeGraphListObjects(): Promise<S3Object[]> {
        return await this.storage.listObjects(KnowledgeGraphService.S3_PREFIX)
    }

    async publishKnowledgeGraph(graphName: string): Promise<void> {
        await this.updateKnowledgeGraphTags(graphName, { public: 'true' });
    }

    async unpublishKnowledgeGraph(graphName: string): Promise<void> {
        await this.updateKnowledgeGraphTags(graphName, { public: 'false' });
    }

    async getKnowledgeGraph(graphName: string): Promise<ReadableStream> {
        const objectKey = KnowledgeGraphService.s3Key(graphName);

        if (await this.storage.hasObject(objectKey)) {
            return this.storage.getObject(objectKey);
        }
        return null;
    }

    public deleteKnowledgeGraph(graphName: string) {
        const objectKey = KnowledgeGraphService.s3Key(graphName);

        return this.storage.deleteObject(objectKey);
    }

    private async updateKnowledgeGraphTags(graphName: string, tags: Record<string, string>): Promise<void> {
        const objectKey = KnowledgeGraphService.s3Key(graphName);
        await this.storage.patchTags(objectKey, tags);
    }

}
