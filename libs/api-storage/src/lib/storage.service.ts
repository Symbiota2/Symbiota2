import { Inject, Injectable, Logger } from '@nestjs/common';
import { S3_STORAGE_PROVIDER_ID } from './s3-client.provider';
import { AppConfigService } from '@symbiota2/api-config';
import ReadableStream = NodeJS.ReadableStream;
import { PassThrough } from 'stream';
import { S3 } from 'aws-sdk';
import {
    DeleteObjectRequest,
    GetObjectRequest,
    HeadObjectRequest,
    PutObjectRequest
} from 'aws-sdk/clients/s3';
import WritableStream = NodeJS.WritableStream;

@Injectable()
export class StorageService {
    private readonly logger = new Logger(StorageService.name);

    constructor(
        @Inject(S3_STORAGE_PROVIDER_ID) private readonly s3Client: S3,
        private readonly appConfig: AppConfigService) { }

    private get bucket(): string {
        return this.appConfig.storageBucket();
    }

    async putObject(objectKey: string, objectValue: ReadableStream) {
        this.logger.debug(`Uploading object to s3://${this.bucket}/${objectKey}`);
        const req: PutObjectRequest = {
            Bucket: this.bucket,
            Key: objectKey,
            Body: objectValue
        };
        await this.s3Client.upload(req).promise();
        this.logger.debug(`Upload to s3://${this.bucket}/${objectKey} complete`);
    }

    async hasObject(objectKey: string): Promise<boolean> {
        const req: HeadObjectRequest = {
            Bucket: this.bucket,
            Key: objectKey
        };

        return new Promise((resolve) => {
           this.s3Client.headObject(req)
               .on('success', () => resolve(true))
               .on('error', () => resolve(false))
               .send();
        });
    }

    getObject(objectKey: string): ReadableStream {
        this.logger.debug(`Retrieving object at s3://${this.bucket}/${objectKey}`);
        const command: GetObjectRequest = {
            Bucket: this.bucket,
            Key: objectKey
        };
        const outputStream = new PassThrough();

        this.s3Client.getObject(command)
            .on('httpData', (data) => outputStream.write(data))
            .on('httpDone', () => outputStream.end())
            .on('httpError', (e) => {
                throw e;
            })
            .send();

        return outputStream;
    }

    async deleteObject(objectKey: string) {
        this.logger.debug(`Deleting object at s3://${this.bucket}/${objectKey}`);
        const req: DeleteObjectRequest = {
            Bucket: this.bucket,
            Key: objectKey
        };
        await this.s3Client.deleteObject(req).promise();
    }
}
