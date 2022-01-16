import { Inject, Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { BaseService } from '@symbiota2/api-common'
import { Image, Taxon } from '@symbiota2/api-database';
import { ImageFindAllParams } from './dto/image-find-all.input.dto'
import { Express } from 'express';
import { StorageService } from '@symbiota2/api-storage';
import * as fs from 'fs';
import { ImageSearchParams } from './dto/ImageSearchParams';
import * as Path from 'path';

type File = Express.Multer.File

@Injectable()
export class ImageService extends BaseService<Image>{
    private static readonly S3_PREFIX = 'image'
    public static readonly imageUploadFolder = './data/uploads/images/'
    public static readonly imageLibraryFolder = './imglib/'

    constructor(
        @Inject(Image.PROVIDER_ID)
        private readonly myRepository: Repository<Image>,
        private readonly storageService: StorageService)
    {
        super(myRepository)
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

    /* Search
    Can limit the list by a list of ids.
    Can also limit the number fetched and use an offset.
    */
    async imageSearch(params?: ImageSearchParams): Promise<Image[]> {
        const { limit, offset, ...qParams } = params;

        let qb = this.myRepository.createQueryBuilder('image')
            .select()
            .innerJoinAndSelect("image.taxon", "taxon")
            .where('true')
        if (params?.limit) {
            qb = qb.limit(limit)
        }
        if (params?.offset) {
            qb = qb.offset(offset)
        }
        if (qParams.taxaid) {
            qb = qb.andWhere("image.taxonID IN (:...taxaIDs)",
                    { taxaIDs: qParams.taxaid })
        }
        if (qParams.type) {
            qb = qb.andWhere("image.type IN (:...imageTypes)",
                    { imageTypes: qParams.type })
        }
        if (qParams.photographer) {
            qb = qb.andWhere("image.photographerName IN (:...photographers)",
                    { photographers: qParams.photographer })
        }
        if (qParams.key) {
            qb = qb.leftJoinAndSelect("image.tags", "tags")
                .andWhere("tags.keyValueStr IN (:...tagKeys)",
                    { tagKeys: qParams.key })
        }
        if (qParams.country || qParams.province) {
            qb = qb.leftJoinAndSelect("image.occurrence", "occurrence")
            if (qParams.country) {
                qb = qb.andWhere("occurrence.country IN (:...countries)",
                    { countries: qParams.country })
            }
            if (qParams.province) {
                qb = qb.andWhere("occurrence.stateProvince IN (:...provinces)",
                    { provinces: qParams.province })
            }
        }
        return await qb.getMany()
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
        const taxon = this.myRepository.create(data)
        return this.myRepository.save(taxon)
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

    async fromFileToStorageService(originalname: string, filename: string, mimetype: string): Promise<void> {
        const readStream = fs.createReadStream(ImageService.imageUploadFolder + filename)
        await this.storageService.putObject(
            ImageService.s3Key(filename),
            readStream,
            {"contentType" : mimetype}
        )
    }

    async fromFileToLocalStorage(originalname: string, filename: string, mimetype: string): Promise<void> {
        fs.rename(ImageService.imageUploadFolder + filename, ImageService.imageLibraryFolder + originalname, (err) => {
            if (err) throw err
            console.log('Successfully uploaded ' + ImageService.imageLibraryFolder + originalname)
        })
    }

}
