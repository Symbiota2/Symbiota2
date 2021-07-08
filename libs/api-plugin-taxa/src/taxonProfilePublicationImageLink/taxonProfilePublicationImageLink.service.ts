import { Inject, Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { BaseService } from '@symbiota2/api-common'
import { TaxonProfilePublicationImageLink } from '@symbiota2/api-database'
import { TaxonProfilePublicationImageLinkFindAllParams } from './dto/taxonProfilePublicationImageLink-find-all.input.dto';

@Injectable()
export class TaxonProfilePublicationImageLinkService extends BaseService<TaxonProfilePublicationImageLink>{
    constructor(
        @Inject(TaxonProfilePublicationImageLink.PROVIDER_ID)
        private readonly myRepository: Repository<TaxonProfilePublicationImageLink>) {

        super(myRepository)
    }

    /*
    Fetch all of the taxon links.
    Can limit the list by a list of ids.
    Can also limit the number fetched and use an offset.
     */
    async findAll(params?: TaxonProfilePublicationImageLinkFindAllParams): Promise<TaxonProfilePublicationImageLink[]> {
        const { limit, offset, ...qParams } = params

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            : this.myRepository.find({take: limit, skip: offset})
    }

    /*
    TODO: Not sure if this is implemented correctly.
     */
    async create(data: Partial<TaxonProfilePublicationImageLink>): Promise<TaxonProfilePublicationImageLink> {
        const taxon = this.myRepository.create(data)
        return this.myRepository.save(taxon)
    }

    /*
    TODO: Implement
     */
    async updateByID(imageID: number, data: Partial<TaxonProfilePublicationImageLink>): Promise<TaxonProfilePublicationImageLink> {
        const updateResult = await this.myRepository.update({ imageID }, data)
        if (updateResult.affected > 0) {
            return this.findByID(imageID)
        }
        return null
    }

}
