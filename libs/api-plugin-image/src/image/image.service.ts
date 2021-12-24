import { Inject, Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { BaseService } from '@symbiota2/api-common'
import { Image, Taxon } from '@symbiota2/api-database';
import { ImageFindAllParams } from './dto/image-find-all.input.dto'
import { Express } from 'express';
import { StorageService } from '@symbiota2/api-storage';
import * as fs from 'fs';

type File = Express.Multer.File

@Injectable()
export class ImageService extends BaseService<Image>{
    private static readonly S3_PREFIX = 'image'
    public static readonly imageUploadFolder = './data/uploads/images/'

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
                ['o.imageType as imageType', 'count(*) as sortSequence']
            )
            //.distinct(true)
            //.limit(100)
            .where('o.imageType IS NOT NULL')
            .groupBy('o.imageType')
            //.orderBy('o.photographerName')

        return await qb.getRawMany()
    }

    /*
    Fetch all of the taxon links.
    Can limit the list by a list of ids.
    Can also limit the number fetched and use an offset.
    */
    async findByTaxonIDs(params?: ImageFindAllParams): Promise<Image[]> {
        const { limit, offset, ...qParams } = params;

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { taxonID: In(params.id)}})
            : []
    }


    /*
    TODO: Not sure if this is implemented correctly.
     */
    async create(data: Partial<Image>): Promise<Image> {
        const taxon = this.myRepository.create(data);
        return this.myRepository.save(taxon);
    }

    /*
    TODO: Implement
     */
    async updateByID(id: number, data: Partial<Image>): Promise<Image> {
        const updateResult = await this.myRepository.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id);
        }
        return null;
    }

    async fromFile(originalname: string, filename: string, mimetype: string): Promise<void> {
        const readStream = fs.createReadStream(ImageService.imageUploadFolder + filename)
        await this.storageService.putObject(
            ImageService.s3Key(filename),
            readStream,
            {"contentType" : mimetype}
        )
    }

}
