import { Module } from '@nestjs/common'
import { DatabaseModule } from '@symbiota2/api-database'
import { AppConfigModule, AppConfigService } from '@symbiota2/api-config';
import { ImageService } from './image/image.service'
import { ImageController } from './image/image.controller'
import { SymbiotaApiPlugin } from '@symbiota2/api-common'
import { ImageTagService } from './imageTag/imageTag.service';
import { ImageTagKeyService } from './imageTagKey/imageTagKey.service';
import { ImageTagKeyController } from './imageTagKey/imageTagKey.controller';
import { ImageTagController } from './imageTag/imageTag.controller';
import { StorageModule } from '@symbiota2/api-storage';
import { ImageFolderUploadProcessor } from './queues/image-folder-upload.processor';
import { ImageFolderUploadCleanupProcessor } from './queues/image-folder-upload-cleanup.processor';
import { MulterModule } from '@nestjs/platform-express';
import { join as pathJoin } from 'path';
import { promises as fsPromises } from 'fs';
import { ImageFolderUploadCleanupQueue } from './queues/image-folder-upload-cleanup.queue';
import { ImageFolderUploadQueue } from './queues/image-folder-upload.queue';

@Module({
    imports: [AppConfigModule,DatabaseModule,
        MulterModule.registerAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: async (appConfig: AppConfigService) => {
                const uploadDirectory = pathJoin(
                    await appConfig.dataDir(),
                    'uploads',
                    'images'
                );

                try {
                    await fsPromises.stat(uploadDirectory);
                }
                catch (e) {
                    await fsPromises.mkdir(
                        uploadDirectory,
                        { mode: 0o700, recursive: true }
                    );
                }

                return {
                    // TODO: Configurable upload limit
                    dest: uploadDirectory,
                    limits: {
                        fileSize: 1074000000 // 1GiB
                    }
                }
            },
        }),
        ImageFolderUploadCleanupQueue,
        ImageFolderUploadQueue, StorageModule],
    providers: [
        ImageService,
        ImageTagService,
        ImageTagKeyService,
        ImageFolderUploadCleanupProcessor,
        ImageFolderUploadProcessor,
    ],
    controllers: [
        ImageController,
        ImageTagController,
        ImageTagKeyController,
    ],
    exports: [
        ImageService,
        ImageTagService,
        ImageTagKeyService,
    ]
})
export class ImageModule extends SymbiotaApiPlugin {}
