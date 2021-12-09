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
import { DwcArchiveBuilder } from '@symbiota2/dwc';
import { createReadStream } from 'fs';
import { Collection, Occurrence } from '@symbiota2/api-database';
import ReadableStream = NodeJS.ReadableStream;

interface CreateArchiveOpts {
    publish?: boolean;
}

@Injectable()
export class DwCService {
    private static readonly S3_PREFIX = 'dwc';
    private static readonly DB_LIMIT = 1024;
    private static readonly DEFAULT_CREATE_ARCHIVE_OPTS: CreateArchiveOpts = {
        publish: false
    };
    private static readonly REGEX_SPACE_REPLACE = new RegExp(/\s/g);

    constructor(
        @Inject(Collection.PROVIDER_ID) private readonly collections: Repository<Collection>,
        @Inject(Occurrence.PROVIDER_ID) private readonly occurrences: Repository<Occurrence>,
        private readonly appConfig: AppConfigService,
        private readonly storage: StorageService) { }

    private static s3Key(objectName: string): string {
        return [DwCService.S3_PREFIX, objectName].join('/');
    }

    // TODO: Redact sensitive localities
    // TODO: Include determination history

    private async createArchive<T>(archiveName: string, entityCls: EntityTarget<T>, findOpts: FindManyOptions<T>, objectTags = {}) {
        const db = getConnection();
        const repo = db.getRepository(entityCls);

        const dataDir = await this.appConfig.dataDir();
        const dwcBuilder = new DwcArchiveBuilder(entityCls, dataDir);
        const uploadPath = DwCService.s3Key(archiveName);

        return new Promise<void>((resolve, reject) => {
            withTempDir(dataDir, async (tmpDir) => {
                try {
                    let offset = 0;
                    let entities = await repo.find({
                        ...findOpts,
                        take: DwCService.DB_LIMIT,
                        skip: offset
                    });

                    while (entities.length > 0) {
                        await Promise.all(entities.map((o) => dwcBuilder.addRecord(o)));
                        offset += entities.length;
                        entities = await repo.find({
                            ...findOpts,
                            take: DwCService.DB_LIMIT,
                            skip: offset
                        });
                    }

                    const archivePath = pathJoin(tmpDir, archiveName);
                    await dwcBuilder.build(archivePath);
                    await this.storage.putObject(uploadPath, createReadStream(archivePath), objectTags);

                    resolve();

                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    async createArchiveForCollection(collectionID: number, opts = DwCService.DEFAULT_CREATE_ARCHIVE_OPTS): Promise<string> {
        const archiveName = await this.collectionArchiveName(collectionID);
        const tags = {
            collectionID: collectionID.toString(),
            public: opts.publish.toString()
        };

        // Make sure all of the occurrences have a guid
        await this.occurrences.createQueryBuilder('o')
            .update({ occurrenceGUID: () => "CONCAT('urn:uuid:', UUID())" })
            .where({ collectionID, occurrenceGUID: IsNull() })
            .execute();

        await this.createArchive(
            archiveName,
            Occurrence,
            {
                where: { collectionID },
                relations: ['taxon']
            },
            tags
        );

        return archiveName;
    }

    async listArchives(): Promise<{ collectionID: number, objectKey: string, isPublic: boolean, updatedAt: Date, size: number }[]> {
        const archiveKeys = await this.storage.listObjects(DwCService.S3_PREFIX);
        const archives = await Promise.all(
            archiveKeys.map(async (k) => {
                const archiveTags = await this.storage.getTags(k.key);
                const archive = {
                    objectKey: k.key,
                    collectionID: -1,
                    isPublic: false,
                    updatedAt: new Date(k.updatedAt),
                    size: k.size
                };
                const tagNames = Object.keys(archiveTags);
                if (tagNames.includes('collectionID')) {
                    archive.collectionID = parseInt(archiveTags['collectionID']);
                }
                archive.isPublic = (
                    tagNames.includes('public') &&
                    archiveTags['public'] === 'true'
                );

                return archive;
            })
        );

        return archives.filter((a) => a.collectionID !== -1).sort((a, b) => {
            if (a.collectionID > b.collectionID) {
                return 1;
            }
            else if (a.collectionID < b.collectionID) {
                return -1;
            }
            return 0;
        });
    }

    async collectionArchiveExists(collectionID: number): Promise<boolean> {
        const archiveName = await this.collectionArchiveName(collectionID);
        return await this.storage.hasObject(DwCService.s3Key(archiveName));
    }

    async publishCollectionArchive(collectionID: number): Promise<void> {
        await this.updateCollectionTags(collectionID, { public: 'true' });
    }

    async unpublishCollectionArchive(collectionID: number): Promise<void> {
        await this.updateCollectionTags(collectionID, { public: 'false' });
    }

    async getCollectionArchive(collectionID: number): Promise<ReadableStream> {
        const archiveName = await this.collectionArchiveName(collectionID);
        const objectKey = DwCService.s3Key(archiveName);

        if (await this.storage.hasObject(objectKey)) {
            return this.storage.getObject(objectKey);
        }
        return null;
    }

    private retrieveArchive(archiveName: string): ReadableStream {
        return this.storage.getObject(archiveName);
    }

    private async updateCollectionTags(collectionID: number, tags: Record<string, string>): Promise<void> {
        const archiveName = await this.collectionArchiveName(collectionID);
        const objectKey = DwCService.s3Key(archiveName);
        await this.storage.patchTags(objectKey, tags);
    }

    private async collectionArchiveName(collectionID: number): Promise<string> {
        const collection = await this.collections.findOne({
            select: ['collectionName', 'collectionCode'],
            where: { id: collectionID }
        });
        if (!collection) {
            throw new Error(`Collection with ID ${collectionID} does not exist!`);
        }
        const archivePrefix = (
            collection.collectionCode ||
            collection.collectionName.replace(DwCService.REGEX_SPACE_REPLACE, '-')
        );
        return `${ archivePrefix }_DwC-A.zip`;
    }
}
