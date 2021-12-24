import { Inject, Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { BaseService } from '@symbiota2/api-common'
import { ImageTag, ImageTagKey } from '@symbiota2/api-database';
import { ImageTagFindAllParams } from './dto/image-tag-find-all.input.dto'

@Injectable()
export class ImageTagService extends BaseService<ImageTag>{

    constructor(
        @Inject(ImageTag.PROVIDER_ID)
        private readonly myRepository: Repository<ImageTag>)
    {
        super(myRepository)
    }

    /*
    Fetch all of the images.
    Can limit the list by a list of ids.
    Can also limit the number fetched and use an offset.
     */
    async findAll(params?: ImageTagFindAllParams): Promise<ImageTag[]> {
        const { limit, offset, ...qParams } = params;

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            : this.myRepository.find({take: limit, skip: offset})
    }

    /*
    TODO: Not sure if this is implemented correctly.
     */
    async create(data: Partial<ImageTag>): Promise<ImageTag> {
        const taxon = this.myRepository.create(data);
        return this.myRepository.save(taxon);
    }

    /*
    TODO: Implement

    async updateByID(id: number, data: Partial<ImageTag>): Promise<ImageTag> {
        const updateResult = await this.myRepository.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id);
        }
        return null;
    }

     */

}
