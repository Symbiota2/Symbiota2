import { Module } from '@nestjs/common';
import { AppConfigModule, AppConfigService } from '@symbiota2/api-config';
import { createS3Client, S3_STORAGE_PROVIDER_ID } from './s3-client.provider';
import { StorageService } from './storage.service';

@Module({
    imports: [AppConfigModule],
    controllers: [],
    providers: [
        {
            provide: S3_STORAGE_PROVIDER_ID,
            useFactory: createS3Client,
            inject: [AppConfigService]
        },
        StorageService
    ],
    exports: [StorageService]
})
export class ApiStorageModule { }
