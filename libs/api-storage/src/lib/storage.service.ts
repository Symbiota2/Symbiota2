import { Inject, Injectable, Logger } from '@nestjs/common';
import { S3_STORAGE_PROVIDER_ID } from './s3-client.provider';
import { AppConfigService } from '@symbiota2/api-config';
import ReadableStream = NodeJS.ReadableStream;
import { PassThrough } from 'stream';
import { S3 } from 'aws-sdk';
import {
    DeleteObjectRequest,
    GetObjectRequest, GetObjectTaggingRequest,
    HeadObjectRequest, ListObjectsRequest,
    PutObjectRequest, PutObjectTaggingRequest, Tag
} from 'aws-sdk/clients/s3';

export interface S3Object {
    key: string;
    updatedAt: Date;
    size: number;
}

@Injectable()
export class StorageService {
    private readonly logger = new Logger(StorageService.name);

    constructor(
        @Inject(S3_STORAGE_PROVIDER_ID) private readonly s3Client: S3,
        private readonly appConfig: AppConfigService) { }

    private get bucket(): string {
        return this.appConfig.storageBucket();
    }

    async putObject(objectKey: string, objectValue: ReadableStream, tags?: Record<string, string>) {
        this.logger.debug(`Uploading object to s3://${this.bucket}/${objectKey}`);
        const req: PutObjectRequest = {
            Bucket: this.bucket,
            Key: objectKey,
            Body: objectValue
        };
        if (tags) {
            req.Tagging = StorageService.encodeObjectTags(tags);
        }

        await this.s3Client.upload(req).promise();
        this.logger.debug(`Upload to s3://${this.bucket}/${objectKey} complete`);
    }

    async putData(objectKey: string, data: string | Buffer, tags?: Record<string, string>) {
        const dataStream = new PassThrough();
        const putObjPromise = this.putObject(objectKey, dataStream, tags);
        dataStream.write(data);
        dataStream.end();
        return await putObjPromise;
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

    async getData(objectKey: string): Promise<Buffer> {
        const stream = await this.getObject(objectKey);
        const chunks = [];
        stream.on('data', (d) => chunks.push(d));

        return new Promise((resolve, reject) => {
            stream.once('error', (e) => {
                reject(e);
            });
            stream.once('end', () => {
                resolve(Buffer.concat(chunks));
            });
        });
    }

    async deleteObject(objectKey: string) {
        this.logger.debug(`Deleting object at s3://${this.bucket}/${objectKey}`);
        const req: DeleteObjectRequest = {
            Bucket: this.bucket,
            Key: objectKey
        };
        await this.s3Client.deleteObject(req).promise();
    }

    async patchTags(objectKey: string, tags: Record<string, string>): Promise<void> {
        this.logger.debug(`Tagging object at s3://${this.bucket}/${objectKey}`);

        const currentTags = await this.getTags(objectKey);
        tags = { ...currentTags, ...tags };

        const newTags: Tag[] = [];
        for (const [k, v] of Object.entries(tags)) {
            newTags.push({ Key: k, Value: v });
        }

        const putReq: PutObjectTaggingRequest = {
            Bucket: this.bucket,
            Key: objectKey,
            Tagging: {
                TagSet: newTags
            }
        };

        await this.s3Client.putObjectTagging(putReq).promise();
    }

    async getTags(objectKey: string): Promise<Record<string, string>> {
        const getReq: GetObjectTaggingRequest = {
            Bucket: this.bucket,
            Key: objectKey
        };
        const tagResponse = await this.s3Client.getObjectTagging(getReq).promise();
        const currentTags = {};

        for (const tag of tagResponse.TagSet) {
            currentTags[tag.Key] = tag.Value;
        }

        return currentTags;
    }

    async listObjects(pathPrefix: string): Promise<S3Object[]> {
        const req: ListObjectsRequest = {
            Bucket: this.bucket,
            Prefix: pathPrefix
        };
        const objs = await this.s3Client.listObjectsV2(req).promise();
        return objs.Contents.map((o) => {
            return {
                key: o.Key,
                updatedAt: o.LastModified,
                size: o.Size
            }
        });
    }

    private static encodeObjectTags(tags: Record<string, string>): string {
        const tagsUri = new URLSearchParams();
        for (const [k, v] of Object.entries(tags)) {
            tagsUri.set(k, v);
        }
        return tagsUri.toString();
    }
}
