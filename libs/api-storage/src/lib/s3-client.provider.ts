import * as AWS from 'aws-sdk';
import { AppConfigService } from '@symbiota2/api-config';
import { CreateBucketRequest, HeadBucketRequest } from 'aws-sdk/clients/s3';

export const S3_STORAGE_PROVIDER_ID = 'S3Client';

export async function createS3Client(appConfig: AppConfigService): Promise<AWS.S3> {
    const client = new AWS.S3({
        endpoint: appConfig.storageServer(),
        accessKeyId: appConfig.storageUser(),
        secretAccessKey: appConfig.storagePassword(),
        // Need this for minio
        s3ForcePathStyle: true,
        signatureVersion: 'v4'
    });

    const req: HeadBucketRequest | CreateBucketRequest = {
        Bucket: appConfig.storageBucket()
    };

    try {
        await client.headBucket(req).promise();
    }
    catch (e) {
        await client.createBucket(req).promise();
    }

    return client;
}
