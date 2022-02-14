import { Inject, Injectable } from '@nestjs/common';
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
import { KnowledgeGraphBuilder } from '@symbiota2/knowledgeGraph';

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
    private static readonly REGEX_SPACE_REPLACE = new RegExp(/\s/g);

    constructor(
        @Inject(Collection.PROVIDER_ID) private readonly collections: Repository<Collection>,
        @Inject(Occurrence.PROVIDER_ID) private readonly occurrences: Repository<Occurrence>,
        private readonly appConfig: AppConfigService,
        private readonly storage: StorageService) { }

    private static s3Key(objectName: string): string {
        return [KnowledgeGraphService.S3_PREFIX, objectName].join('/');
    }

    // TODO: Redact sensitive localities
    // TODO: Include determination history

    private async createGraph<T>(graphName: string, entityCls: EntityTarget<T>, findOpts: FindManyOptions<T>, objectTags = {}) {
        const db = getConnection();
        const repo = db.getRepository(entityCls);

        const dataDir = await this.appConfig.dataDir();
        const dwcBuilder = new KnowledgeGraphBuilder(entityCls, dataDir);
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
                        await Promise.all(entities.map((o) => dwcBuilder.addRecord(o)));
                        offset += entities.length;
                        entities = await repo.find({
                            ...findOpts,
                            take: KnowledgeGraphService.DB_LIMIT,
                            skip: offset
                        });
                    }

                    const graphPath = pathJoin(tmpDir, graphName);
                    await dwcBuilder.build(graphPath);
                    await this.storage.putObject(uploadPath, createReadStream(graphPath), objectTags);

                    resolve();

                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    async createGraphForCollection(collectionID: number, opts = KnowledgeGraphService.DEFAULT_CREATE_ARCHIVE_OPTS): Promise<string> {
        const graphName = await this.collectionGraphName(collectionID);
        const tags = {
            collectionID: collectionID.toString(),
            public: opts.publish.toString()
        };

        // Make sure all of the occurrences have a guid
        await this.occurrences.createQueryBuilder('o')
            .update({ occurrenceGUID: () => "CONCAT('urn:uuid:', UUID())" })
            .where({ collectionID, occurrenceGUID: IsNull() })
            .execute();

        await this.createGraph(
            graphName,
            Occurrence,
            {
                where: { collectionID },
                relations: ['taxon']
            },
            tags
        );

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

    async collectionGraphExists(collectionID: number): Promise<boolean> {
        const graphName = await this.collectionGraphName(collectionID);
        return await this.storage.hasObject(KnowledgeGraphService.s3Key(graphName));
    }

    async publishCollectionGraph(collectionID: number): Promise<void> {
        await this.updateCollectionTags(collectionID, { public: 'true' });
    }

    async unpublishCollectionGraph(collectionID: number): Promise<void> {
        await this.updateCollectionTags(collectionID, { public: 'false' });
    }

    async getCollectionGraph(collectionID: number): Promise<ReadableStream> {
        const graphName = await this.collectionGraphName(collectionID);
        const objectKey = KnowledgeGraphService.s3Key(graphName);

        if (await this.storage.hasObject(objectKey)) {
            return this.storage.getObject(objectKey);
        }
        return null;
    }

    private retrieveGraph(graphName: string): ReadableStream {
        return this.storage.getObject(graphName);
    }

    private async updateCollectionTags(collectionID: number, tags: Record<string, string>): Promise<void> {
        const graphName = await this.collectionGraphName(collectionID);
        const objectKey = KnowledgeGraphService.s3Key(graphName);
        await this.storage.patchTags(objectKey, tags);
    }

    private async collectionGraphName(collectionID: number): Promise<string> {
        const collection = await this.collections.findOne({
            select: ['collectionName', 'collectionCode'],
            where: { id: collectionID }
        });
        if (!collection) {
            throw new Error(`Collection with ID ${collectionID} does not exist!`);
        }
        const graphPrefix = (
            collection.collectionCode ||
            collection.collectionName.replace(KnowledgeGraphService.REGEX_SPACE_REPLACE, '-')
        );
        return `${ graphPrefix }_KnowledgeGraph-A.zip`;
    }
}
