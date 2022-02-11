import {
    InjectQueue,
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Inject, Logger } from '@nestjs/common';
import {
    ImageFolderUpload,
    UserNotification, Image, Occurrence
} from '@symbiota2/api-database';
import { DeepPartial, IsNull, Like, Repository } from 'typeorm';
import { QUEUE_ID_IMAGE_FOLDER_UPLOAD } from './image-folder-upload.queue';
import { csvIteratorWithTrimValues, objectIterator, readXmlFile } from '@symbiota2/api-common';
import * as fs from 'fs';
import { StorageService } from '@symbiota2/api-storage';
import zipExtract from 'extract-zip';
import { IDwCAMeta } from '@symbiota2/dwc';
import path from 'path';
import { OccurrenceService } from '@symbiota2/api-plugin-occurrence';
import { from, Observable } from 'rxjs';
import { ImageService } from '../image/image.service';

export interface ImageFolderUploadJob {
    uid: number
    uploadID: number
    imageUpdates : Image[]
    skippedImagesDueToNoMatch : string[]
    skippedImagesDueToTooManyMatches: string[]
}

@Processor(QUEUE_ID_IMAGE_FOLDER_UPLOAD)
export class ImageFolderUploadProcessor {
    private processed = 0
    private static MAX_SKIPPED_BUFFER_SIZE = 1000 // Limit of how many skipped records of any type we want to keep
    private readonly logger = new Logger(ImageFolderUploadProcessor.name)

    constructor(
        @Inject(ImageFolderUpload.PROVIDER_ID)
        private readonly uploads: Repository<ImageFolderUpload>,
        @Inject(UserNotification.PROVIDER_ID)
        private readonly notifications: Repository<UserNotification>,
        @Inject(Image.PROVIDER_ID)
        private readonly imageRepo: Repository<Image>,
        @Inject(Occurrence.PROVIDER_ID)
        private readonly occurrenceRepo: Repository<Occurrence>,
        //private readonly occurrenceService: OccurrenceService,
        private readonly imageService: ImageService,
        private readonly storageService: StorageService) { }

    // TODO: Wrap in a transaction? Right now each chunk goes straight to the database until a failure occurs
    @Process()
    async upload(job: Job<ImageFolderUploadJob>): Promise<void> {
        // Get the upload info
        const upload = await this.uploads.findOne(job.data.uploadID)
        if (!upload) {
            return
        }
        this.logger.log(`Upload of '${upload.filePath}' started...`)

        // Process the zip file extracting to a folder
        let error: Error = null
        const outputDir = path.join(ImageService.imageUploadFolder, upload.filePath)
        await zipExtract(upload.filePath,
            { dir: outputDir });

        // Update the job status
        upload.status = "started"
        await this.uploads.save(upload)

        // Now let's process all the images
        if (error) {
            await job.moveToFailed(error)
        } else {
            error = await this.processImages(job, upload, outputDir)
            if (error) {
                this.logger.error(" Error detected in processing images file")
                await job.moveToFailed(error)
            }
        }

        try {
            await this.onImageUploadComplete(job.data.uid)
            // Update the job status
            await this.writeBadRows(job)
            upload.status = "done"
            await this.uploads.save(upload)
        } catch (e) {
            await job.moveToFailed(e);
        }
    }

    private async writeBadRows(job) {
        await this.writeRows(job.data.skippedImagesDueToTooManyMatches, ImageService.skippedImagesDueToTooManyMatches)
        await this.writeRows(job.data.skippedImagesDueToNoMatch, ImageService.skippedImagesDueToNoMatch)
    }

    private async writeRows(a, path) {
        await this.storageService.putData(ImageService.s3Key(path), this.convertToCSV(a))
    }

    private convertToCSV(objArray) {
        const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
        let str = ''

        for (let i = 0; i < array.length; i++) {
            let line = ''
            for (let index in array[i]) {
                if (line != '') line += ','

                line += array[i][index]
            }

            str += line + '\r\n'
        }

        return str
    }

    @OnQueueCompleted()
    async queueCompletedHandler(job: Job) {
        this.logger.log(`Upload complete for image folder job ${job.data.authorityID}`);
    }

    @OnQueueFailed()
    async queueFailedHandler(job: Job, err: Error) {
        this.logger.error(JSON.stringify(err));
        try {
            return this.onImageUploadComplete(job.data.uid);
        } catch (e) {
            this.logger.error(`Error updating statistics: ${JSON.stringify(e)}`);
        }
        await this.notifications.save({ uid: job.data.uid, message: `Upload failed: ${JSON.stringify(err)}` });
    }

    /**
     * Process a folder of images
     * Read through all the files updating the image table and putting problems into a file.
     * @param job - the job to process (with the file information
     * @parmm upload - the upload process
     * @param outputDir - where the processed images should go
     * @return nothing
     */
    private async processImages(job: Job<ImageFolderUploadJob>, upload: ImageFolderUpload, outputDir: string) {

        // list of all the updates to do to image records
        const imageUpdates : Image[] = []
        const skippedImagesDueToNoMatch = job.data.skippedImagesDueToNoMatch
        const skippedImagesDueToTooManyMatches = job.data.skippedImagesDueToTooManyMatches

        fs.readdir(outputDir, (err, files) => {
            if (err) return err  // exit on error and report it
            files.forEach(file => {
                const parts = file.split('_')
                // Pop off the last _ part if more than one
                if (parts.length > 1) {
                    parts.pop()
                }
                const filePrefix = parts.join('_')
                // First let's try to match just on scientific name
                const occurrences = from(this.getOccurrences(filePrefix))
                occurrences.subscribe((occs) => {
                    if (occs.length == 0) {
                        // Problematic upload, no matching catalog number
                        skippedImagesDueToNoMatch.push(file)
                    } else if (occs.length > 1) {
                        // Found too many, again problematic
                        skippedImagesDueToTooManyMatches.push(file)
                    } else {
                        // Found only one, let's add this image
                        // First create a thumbnail
                        const names = this.imageService.fromFileToLocalStorage(file, file, "")
                        // Now create an image record
                        // Create
                        const imageRec = this.imageRepo.create({
                            url: names[0],
                            thumbnailUrl: names[1],
                            sourceUrl: file,
                            occurrenceID: occs[0].id,
                            taxonID: occs[0].taxonID
                        })
                        // Add to queue of image updates to perform
                        imageUpdates.push(imageRec)
                    }
                })
                console.log(file);
            });
        });

        // Save all of the images
        await this.imageRepo.save(imageUpdates)
        this.processed += imageUpdates.length

        let logMsg = `Processing uploaded images `
        logMsg += `(${new Intl.NumberFormat().format(imageUpdates.length)} images processed. `
        this.logger.log(logMsg)
        return null // everything worked!
    }

    private async getOccurrences(name)  {
        return await this.occurrenceRepo.find({
            where: { catalogName: Like(name + "%") }
        })
    }

    private async onImageUploadComplete(uid: number) {
        await this.notifications.save({
            uid,
            message: `Your image upload has completed`
        })
    }
}
