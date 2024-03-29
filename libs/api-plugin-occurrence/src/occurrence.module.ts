/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { OccurrenceService } from './occurrence/occurrence.service';
import { OccurrenceController } from './occurrence/occurrence.controller';
import { DatabaseModule } from '@symbiota2/api-database';
import { MulterModule } from '@nestjs/platform-express';
import { AppConfigModule, AppConfigService } from '@symbiota2/api-config';
import { join as pathJoin } from 'path';
import { promises as fsPromises } from 'fs';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';
import { OccurrenceUploadCleanupQueue } from './queues/occurrence-upload-cleanup.queue';
import { OccurrenceUploadCleanupProcessor } from './queues/occurrence-upload-cleanup.processor';
import { OccurrenceUploadQueue } from './queues/occurrence-upload.queue';
import { OccurrenceUploadProcessor } from './queues/occurrence-upload.processor';
import { CollectionModule } from '@symbiota2/api-plugin-collection';
import { OccurrenceCommentController } from './occurrence-comment/occurrence-comment.controller';
import { OccurrenceCommentService } from './occurrence-comment/occurrence-comment.service';
import { StorageModule } from '@symbiota2/api-storage';
import { DwCModule } from '@symbiota2/api-dwc';

/**
 * Module for retrieving occurrence records from the database
 */
@Module({
    imports: [
        AppConfigModule,
        DatabaseModule,
        MulterModule.registerAsync({
            imports: [AppConfigModule],
            useFactory: async (appConfig: AppConfigService) => {
                const dataDir = await appConfig.dataDir();
                const uploadDir = pathJoin(dataDir, 'uploads', 'occurrences');

                try {
                    await fsPromises.stat(uploadDir);
                }
                catch (e) {
                    await fsPromises.mkdir(
                        uploadDir,
                        { mode: 0o700, recursive: true }
                    );
                }

                return {
                    // TODO: Configurable upload limit
                    dest: uploadDir,
                    limits: {
                        fileSize: 1074000000 // 1GiB
                    }
                }
            },
            inject: [AppConfigService]
        }),
        CollectionModule,
        OccurrenceUploadCleanupQueue,
        OccurrenceUploadQueue,
        StorageModule,
        DwCModule
    ],
    providers: [
        OccurrenceService,
        OccurrenceUploadCleanupProcessor,
        OccurrenceUploadProcessor,
        OccurrenceCommentService,
    ],
    controllers: [OccurrenceController, OccurrenceCommentController]
})
export class OccurrenceModule extends SymbiotaApiPlugin { }
