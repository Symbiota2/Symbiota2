import { Inject, Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { BaseService } from '@symbiota2/api-common'
import { TaxonProfilePublicationDescriptionLink } from '@symbiota2/api-database'
import { TaxonProfilePublicationDescriptionLinkFindAllParams } from './dto/taxonProfilePublicationDescriptionLink-find-all.input.dto';

@Injectable()
export class TaxonProfilePublicationDescriptionLinkService extends BaseService<TaxonProfilePublicationDescriptionLink>{
    constructor(
        @Inject(TaxonProfilePublicationDescriptionLink.PROVIDER_ID)
        private readonly myRepository: Repository<TaxonProfilePublicationDescriptionLink>) {

        super(myRepository)
    }

    /*
    Fetch all of the taxon links.
    Can limit the list by a list of ids.
    Can also limit the number fetched and use an offset.
     */
    async findAll(params?: TaxonProfilePublicationDescriptionLinkFindAllParams): Promise<TaxonProfilePublicationDescriptionLink[]> {
        const { limit, offset, ...qParams } = params

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            : this.myRepository.find({take: limit, skip: offset})
    }

    /*
    TODO: Not sure if this is implemented correctly.
     */
    async create(data: Partial<TaxonProfilePublicationDescriptionLink>): Promise<TaxonProfilePublicationDescriptionLink> {
        const taxon = this.myRepository.create(data)
        return this.myRepository.save(taxon)
    }

    /*
    TODO: Implement
     */
    async updateByID(descriptionBlockID: number, data: Partial<TaxonProfilePublicationDescriptionLink>): Promise<TaxonProfilePublicationDescriptionLink> {
        const updateResult = await this.myRepository.update({ descriptionBlockID }, data)
        if (updateResult.affected > 0) {
            return this.findByID(descriptionBlockID)
        }
        return null
    }

}
