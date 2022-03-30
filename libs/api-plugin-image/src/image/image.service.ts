import { Inject, Injectable, Logger } from '@nestjs/common';
import { Brackets, DeleteResult, In, Repository } from 'typeorm';
import { BaseService } from '@symbiota2/api-common'
import { Image, ImageFolderUpload, Taxon, TaxonomyUpload, TaxonomyUploadFieldMap } from '@symbiota2/api-database';
import { ImageFindAllParams } from './dto/image-find-all.input.dto'
import { Express } from 'express';
import { StorageService } from '@symbiota2/api-storage';
import * as fs from 'fs';
import { ImageSearchParams } from './dto/ImageSearchParams';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_ID_IMAGE_FOLDER_UPLOAD_CLEANUP } from '../queues/image-folder-upload-cleanup.queue';
import { ImageFolderUploadCleanupJob } from '../queues/image-folder-upload-cleanup.processor';
import { AppConfigService } from '@symbiota2/api-config';
import { QUEUE_ID_IMAGE_FOLDER_UPLOAD } from '../queues/image-folder-upload.queue';
import { ImageFolderUploadJob } from '../queues/image-folder-upload.processor';
import path from 'path';
import { Client } from '@elastic/elasticsearch';
const client = new Client({ node: 'http://localhost:9200'})
const imageThumbnail = require('image-thumbnail')


type File = Express.Multer.File

@Injectable()
export class ImageService extends BaseService<Image>{
    public static readonly S3_PREFIX = 'image'
    public static readonly imageUploadFolder = path.join("data", "uploads", "images")
    public static imageLibraryFolder = path.join('imglib')
    public static readonly dataFolderPath = path.join("data", "uploads", "images")
    public static readonly skippedImagesDueToTooManyMatches = path.join(ImageService.dataFolderPath, "skippedTooManyMatches")
    public static readonly skippedImagesDueToNoMatch = path.join(ImageService.dataFolderPath, "skippedNoMatch")
    private readonly logger = new Logger(ImageService.name)

    constructor(
        @Inject(Image.PROVIDER_ID)
        private readonly myRepository: Repository<Image>,
        @Inject(ImageFolderUpload.PROVIDER_ID)
        private readonly uploadRepo: Repository<ImageFolderUpload>,
        @InjectQueue(QUEUE_ID_IMAGE_FOLDER_UPLOAD_CLEANUP)
        private readonly uploadCleanupQueue: Queue<ImageFolderUploadCleanupJob>,
        @InjectQueue(QUEUE_ID_IMAGE_FOLDER_UPLOAD)
        private readonly uploadQueue: Queue<ImageFolderUploadJob>,
        private readonly appConfig: AppConfigService,
        private readonly storageService: StorageService)
    {
        super(myRepository)
        ImageService.imageLibraryFolder = this.appConfig.imageLibrary()
    }

    public static s3Key(objectName: string): string {
        return [ImageService.S3_PREFIX, objectName].join('/');
    }

    /*
    Fetch all of the images.
    Can limit the list by a list of ids.
    Can also limit the number fetched and use an offset.
     */
    async findAll(params?: ImageFindAllParams): Promise<Image[]> {
        const { limit, offset, ...qParams } = params;

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            : this.myRepository.find({take: limit, skip: offset})
    }

    /*
    Fetch distinct photographers info from the image repository.
    */
    async findPhotographerNames(): Promise<Image[]> {
        //return this.myRepository.find({select: ['photographerName']})

        const qb = this.myRepository.createQueryBuilder('o')
            .select(
                'o.photographerName as photographerName'
            )
            .distinct(true)
            //.limit(100)
            .where('o.photographerName IS NOT NULL')
            //.orderBy('o.photographerName')

        return await qb.getRawMany()
    }

    /*
    Fetch distinct photographers info from the image repository.
    */
    async findPhotographers(): Promise<Image[]> {
        //return this.myRepository.find({select: ['photographerName']})

        const qb = this.myRepository.createQueryBuilder('o')
            .select(
                ['o.photographerName', 'o.photographerUID']
            )
            .distinct(true)
            //.limit(100)
            .where('o.photographerName IS NOT NULL')
            .orderBy('o.photographerName')

        return await qb.getRawMany()
    }

    /*
    Fetch image types info from the image repository.
    */
    async findImageTypes(): Promise<Image[]> {
        //return this.myRepository.find({select: ['photographerName']})

        const qb = this.myRepository.createQueryBuilder('o')
            .select(
                ['o.type as type'/*, 'count(*) as sortSequence'*/]
            )
            .distinct(true)
            //.limit(100)
            .where('o.type IS NOT NULL')
            //.groupBy('o.type')
            //.orderBy('o.photographerName')

        return await qb.getRawMany()
    }

    /*
* Contributors Search
* Lots of filters
*/
    async imageSearch(params?: ImageSearchParams): Promise<Image[]> {
        const { limit, offset, ...qParams } = params;

        let qb = this.myRepository.createQueryBuilder('image')
            .select()
            .innerJoinAndSelect("image.taxon", "taxon")
            .where('true')
        if (params?.limit) {
            qb.limit(limit)
        }
        if (params?.offset) {
            qb.offset(offset)
        }
        if (qParams.taxaid) {
            qb = qb.andWhere("image.taxonID IN (:...taxaIDs)",
                { taxaIDs: qParams.taxaid })
        }
        if (qParams.sciname) {
            qb.andWhere("taxon.scientificName IN (:...scinames)",
                { scinames: qParams.sciname })
        }
        if (qParams.keyword) {
            qb.andWhere(new Brackets( qb => {
                qb.where('true')
                qParams.keyword.forEach((word) => {
                    qb.orWhere("image.caption LIKE :word", {word: '%' + word + '%'})
                })
            }))
        }
        if (qParams.commonname) {
            qb.innerJoin("taxon.vernacularNames", "vernacular")
            qb.andWhere("vernacular.vernacularName IN (:...names)",
                { names: qParams.commonname })
        }
        if (qParams.type) {
            qb.andWhere("image.type IN (:...imageTypes)",
                { imageTypes: qParams.type })
        }
        if (qParams.photographer) {
            qb.andWhere("image.photographerName IN (:...photographers)",
                { photographers: qParams.photographer })
        }
        if (qParams.startDate || qParams.endDate || qParams.country || qParams.province || qParams.collectionid) {
            qb = qb.leftJoinAndSelect("image.occurrence", "occurrence")
            if (qParams.collectionid) {
                qb.andWhere("occurrence.collectionID IN (:...ids)",
                    { ids: qParams.collectionid })
            }
            if (qParams.startDate) {
                qb = qb.andWhere("occurrence.dateIdentified <= :date",
                    { date: qParams.startDate })
            }
            if (qParams.endDate) {
                qb = qb.andWhere("occurrence.dateIdentified >= :date",
                    { date: qParams.endDate })
            }
            if (qParams.country) {
                qb = qb.andWhere("occurrence.country IN (:...countries)",
                    { countries: qParams.country })
            }
            if (qParams.province) {
                qb = qb.andWhere("occurrence.stateProvince IN (:...provinces)",
                    { provinces: qParams.province })
            }
        }

        if (qParams.key) {
            qb.leftJoinAndSelect("image.tags", "tags")
                .andWhere("tags.keyValueStr IN (:...tagKeys)",
                    { tagKeys: qParams.key })
        }
        qb.orderBy('image.taxonID, image.occurrenceID')
        return await qb.getMany()
    }

    /*
    * Elasticsearch update index
    * Update the elastic search index
    */
    async updateElasticsearchIndex(params?: ImageSearchParams): Promise<String> {
        const { limit, offset, ...qParams } = params;

        let qb = this.myRepository.createQueryBuilder('image')
            .select()
            .innerJoinAndSelect("image.taxon", "taxon")
            .where('true')
        if (params?.limit) {
            qb.limit(limit)
        }
        if (params?.offset) {
            qb.offset(offset)
        }
        if (qParams.taxaid) {
            qb = qb.andWhere("image.taxonID IN (:...taxaIDs)",
                { taxaIDs: qParams.taxaid })
        }
            // qb.innerJoin("taxon.vernacularNames", "vernacular")

            // qb = qb.leftJoinAndSelect("image.occurrence", "occurrence")


            qb.leftJoinAndSelect("image.tags", "tags")

        const images = qb.getMany()
        return "success"
    }

    /*
    Fetch all of the images using taxon ids.
    Can limit the list by a list of ids.
    Can also limit the number fetched and use an offset.
    */
    async findByTaxonIDs(params?: ImageFindAllParams): Promise<Image[]> {
        const { limit, offset, ...qParams } = params;

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { taxonID: In(params.id)}})
            : []
    }

    /**
     * Create an image record using a Partial Image record
     * @param data The data for the record to create
     * @return number The created data or null (not found)
     */
    async create(data: Partial<Image>): Promise<Image> {
        const image = this.myRepository.create(data)
        return this.myRepository.save(image)
    }

    /**
     * Update an image record using an image id.
     * @param id The id of the image
     * @param data The data to update
     * @return Image The updated data or null (not found or api error)
     */
    async updateByID(id: number, data: Partial<Image>): Promise<Image> {
        const updateResult = await this.myRepository.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id);
        }
        return null;
    }

    /**
     * Delete image records using a taxonID
     * @return number The created data or null (not found)
     */
    async deleteByTaxonID(taxonID: number): Promise<DeleteResult> {
        const image = await this.myRepository.delete({ taxonID: taxonID})
        return image
    }

    async fromFileToStorageService(originalname: string, filename: string, mimetype: string): Promise<void> {
        const readStream = fs.createReadStream(ImageService.imageUploadFolder + filename)

        await this.storageService.putObject(
            ImageService.s3Key(filename),
            readStream,
            {"contentType" : mimetype}
        )
    }

    async fromFileToLocalStorage(originalname: string, filename: string, mimetype: string): Promise<string[]> {

        let thumbnailName = originalname
        try {

            // Create thumbnail
            const thumbnail = await imageThumbnail(filename)
            // Get file name and extension
            const re = /(?:\.([^.]+))?$/
            const extension = re.exec(originalname)[0]

            if (extension) {
                const orig = originalname.substr(0, originalname.length - extension.length)
                thumbnailName = orig + "_tn" + extension
            }
            fs.writeFileSync(path.join(ImageService.imageLibraryFolder,thumbnailName), thumbnail)

            // Move image to image library folder
            fs.copyFile(filename, path.join(ImageService.imageLibraryFolder,originalname), (err) => {
                if (err) {
                    this.logger.error("Error copying uploaded image to image library folder " + err)
                    throw err
                }
            })
            // Let's not unlink as it will be cleaned up later
            /*
            fs.unlink(filename, (err) => {
                if (err) {
                    this.logger.error("Error deleting uploaded image " + err)
                    throw err
                }
            })
             */

        } catch (err) {
            this.logger.error("Error processing thumbnail " + err)
            throw err
        }

        return [path.join(ImageService.imageLibraryFolder,originalname), path.join(ImageService.imageLibraryFolder,thumbnailName)]
    }

    /**
     * Creates a new upload in the database
     * @param filePath The path to the file containing occurrences
     * @param mimeType The mimeType of the file
     */
    async createUpload(filePath: string, mimeType: string): Promise<ImageFolderUpload> {
        let upload = this.uploadRepo.create({ filePath: filePath, mimeType: mimeType, status: ""});
        upload = await this.uploadRepo.save(upload);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        await this.uploadCleanupQueue.add({
            id: upload.id,
            deleteAfter: tomorrow,
        });

        return upload;
    }

    async startUpload(uid: number, uploadID: number): Promise<void> {
        await this.uploadQueue.add({
            uid: uid,
            uploadID: uploadID,
            imageUpdates : [],
            skippedImagesDueToNoMatch : [],
            skippedImagesDueToTooManyMatches: []
        })
    }

}
