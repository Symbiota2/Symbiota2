import { Inject, Injectable, Logger } from '@nestjs/common';
import { StorageService } from '@symbiota2/api-storage';
import {
    EntityTarget,
    FindManyOptions,
    getConnection, IsNull,
    Repository
} from 'typeorm';
import { withTempDir } from '@symbiota2/api-common';
import { AppConfigService } from '@symbiota2/api-config';
import { join as pathJoin } from 'path';
import { createReadStream } from 'fs';
import { Collection, Occurrence } from '@symbiota2/api-database';
import ReadableStream = NodeJS.ReadableStream;
import { getKGProperty, KGRecordType, KnowledgeGraphBuilder } from '@symbiota2/knowledgeGraph';

interface CreateGraphOpts {
    publish?: boolean;
}

@Injectable()
export class KnowledgeGraphService {
    private static readonly S3_PREFIX = 'kg';
    private static readonly DB_LIMIT = 1024;
    private static readonly DEFAULT_CREATE_ARCHIVE_OPTS: CreateGraphOpts = {
        publish: false
    };
    private static readonly REGEX_SPACE_REPLACE = new RegExp(/\s/g)
    private readonly logger = new Logger(KnowledgeGraphService.name)

    constructor(
        @Inject(Collection.PROVIDER_ID) private readonly collections: Repository<Collection>,
        @Inject(Occurrence.PROVIDER_ID) private readonly occurrences: Repository<Occurrence>,
        private readonly appConfig: AppConfigService,
        private readonly storage: StorageService) { }

    private static s3Key(objectName: string): string {
        return [KnowledgeGraphService.S3_PREFIX, objectName].join('/');
    }

    // TODO: Redact sensitive localities
    private async createGraph<T>(
        graphName: string,
        entityCls: EntityTarget<T>,
        findOpts: FindManyOptions<T>,
        objectTags = {}
    ) {
        const db = getConnection();
        const repo = db.getRepository(entityCls);

        console.log("here create Graph")

        const dataDir = await this.appConfig.dataDir();
        const kgBuilder = new KnowledgeGraphBuilder(entityCls, dataDir);
        const uploadPath = KnowledgeGraphService.s3Key(graphName);

        return new Promise<void>((resolve, reject) => {
            withTempDir(dataDir, async (tmpDir) => {
                try {
                    let offset = 0;
                    let entities = await repo.find({
                        ...findOpts,
                        take: KnowledgeGraphService.DB_LIMIT,
                        skip: offset
                    });

                    while (entities.length > 0) {
                        await Promise.all(entities.map((o) => kgBuilder.addRecord(o)));
                        offset += entities.length;
                        entities = await repo.find({
                            ...findOpts,
                            take: KnowledgeGraphService.DB_LIMIT,
                            skip: offset
                        });
                    }

                    const graphPath = pathJoin(tmpDir, graphName);
                    await kgBuilder.build(graphPath);
                    await this.storage.putObject(uploadPath, createReadStream(graphPath), objectTags);

                    resolve();

                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    async createKnowledgeGraph(graphID: number, opts = KnowledgeGraphService.DEFAULT_CREATE_ARCHIVE_OPTS): Promise<string> {
        const graphName = await this.knowledgeGraphName(graphID);
        const tags = {
            graphID: graphID.toString(),
            public: opts.publish.toString()
        };

        const db = getConnection();
        db.entityMetadatas.forEach((entityMeta) => {
            const recordType = KGRecordType(entityMeta.target);
            // console.log("Meta " + entityMeta.name + " " + recordType)
            if (recordType) {
                console.log("Meta " + entityMeta.name)
                const propertyMap = entityMeta.propertiesMap
                for (let key in propertyMap) {
                    const propertyType = getKGProperty(entityMeta.target, key)
                    if (propertyType) {
                        console.log(key + " " + propertyType)
                    }
                }
                //console.log(propertyMap.keys().length)
                //propertyMap.forEach((value, key) => {
                //    console.log(key)
                //});
            }
        })

        this.logger.log("Creating knowledge graph ")

        /*
        // Make sure all of the occurrences have a guid
        await this.occurrences.createQueryBuilder('o')
            .update({ occurrenceGUID: () => "CONCAT('urn:uuid:', UUID())" })
            .where({ graphID, occurrenceGUID: IsNull() })
            .execute();

        await this.createGraph(
            graphName,
            Occurrence,
            {
                where: { graphID },
                relations: ['taxon']
            },
            tags
        );


         */
        return graphName;
    }

    async listGraphs(): Promise<{ collectionID: number, objectKey: string, isPublic: boolean, updatedAt: Date, size: number }[]> {
        const graphKeys = await this.storage.listObjects(KnowledgeGraphService.S3_PREFIX);
        const graphs = await Promise.all(
            graphKeys.map(async (k) => {
                const graphTags = await this.storage.getTags(k.key);
                const graph = {
                    objectKey: k.key,
                    collectionID: -1,
                    isPublic: false,
                    updatedAt: new Date(k.updatedAt),
                    size: k.size
                };
                const tagNames = Object.keys(graphTags);
                if (tagNames.includes('collectionID')) {
                    graph.collectionID = parseInt(graphTags['collectionID']);
                }
                graph.isPublic = (
                    tagNames.includes('public') &&
                    graphTags['public'] === 'true'
                );

                return graph;
            })
        );

        return graphs.filter((a) => a.collectionID !== -1).sort((a, b) => {
            if (a.collectionID > b.collectionID) {
                return 1;
            }
            else if (a.collectionID < b.collectionID) {
                return -1;
            }
            return 0;
        });
    }

    async knowledgeGraphExists(graphID: number): Promise<boolean> {
        const graphName = await this.knowledgeGraphName(graphID);
        return await this.storage.hasObject(KnowledgeGraphService.s3Key(graphName));
    }

    async publishKnowledgeGraph(graphID: number): Promise<void> {
        await this.updateKnowledgeGraphTags(graphID, { public: 'true' });
    }

    async unpublishKnowledgeGraph(graphID: number): Promise<void> {
        await this.updateKnowledgeGraphTags(graphID, { public: 'false' });
    }

    async getKnowledgeGraph(graphID: number): Promise<ReadableStream> {
        const graphName = await this.knowledgeGraphName(graphID);
        const objectKey = KnowledgeGraphService.s3Key(graphName);

        if (await this.storage.hasObject(objectKey)) {
            return this.storage.getObject(objectKey);
        }
        return null;
    }

    private retrieveGraph(graphName: string): ReadableStream {
        return this.storage.getObject(graphName);
    }

    private async updateKnowledgeGraphTags(graphID: number, tags: Record<string, string>): Promise<void> {
        const graphName = await this.knowledgeGraphName(graphID);
        const objectKey = KnowledgeGraphService.s3Key(graphName);
        await this.storage.patchTags(objectKey, tags);
    }

    private async knowledgeGraphName(graphID: number): Promise<string> {
        return `KnowledgeGraph.zip`;
    }
}
