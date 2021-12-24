import { Inject, Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { BaseService } from '@symbiota2/api-common'
import { ImageTagKey } from '@symbiota2/api-database';
import { ImageTagKeyFindAllParams } from './dto/image-tag-key-find-all.input.dto'

@Injectable()
export class ImageTagKeyService extends BaseService<ImageTagKey>{

    constructor(
        @Inject(ImageTagKey.PROVIDER_ID)
        private readonly myRepository: Repository<ImageTagKey>)
    {
        super(myRepository)
    }

    /*
    Fetch all of the images.
    Can limit the list by a list of ids.
    Can also limit the number fetched and use an offset.
     */
    async findAll(params?: ImageTagKeyFindAllParams): Promise<ImageTagKey[]> {
        const { limit, offset, ...qParams } = params;

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            : this.myRepository.find({take: limit, skip: offset})
    }

    /*
    TODO: Not sure if this is implemented correctly.
     */
    async create(data: Partial<ImageTagKey>): Promise<ImageTagKey> {
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
