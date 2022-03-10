import { Inject, Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { BaseService } from '@symbiota2/api-common'
import { TaxonLink } from '@symbiota2/api-database'
import { TaxonLinkFindAllParams } from './dto/taxonLink-find-all.input.dto';

@Injectable()
export class TaxonLinkService extends BaseService<TaxonLink>{
    constructor(
        @Inject(TaxonLink.PROVIDER_ID)
        private readonly myRepository: Repository<TaxonLink>) {

        super(myRepository)
    }

    /*
    Fetch all of the taxon links.
    Can limit the list by a list of ids.
    Can also limit the number fetched and use an offset.
     */
    async findAll(params?: TaxonLinkFindAllParams): Promise<TaxonLink[]> {
        const { limit, offset, ...qParams } = params

        if (qParams.id) {
            if (qParams.taxonID) {
                return await this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id), taxonID: In(params.taxonID)}})
            } else {
                return await this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            }
        } else {
            if (qParams.taxonID) {
                return await this.myRepository.find({take: limit, skip: offset, where: { taxonID: In(params.taxonID)}})
            } else {
                this.myRepository.find({take: limit, skip: offset})
            }
        }
        return []
    }

    /*
    Create a taxon link record
     */
    async create(data: Partial<TaxonLink>): Promise<TaxonLink> {
        const taxon = this.myRepository.create(data);
        return this.myRepository.save(taxon);
    }

    /*
    Update a taxon link record
     */
    async updateByID(id: number, data: Partial<TaxonLink>): Promise<TaxonLink> {
        const updateResult = await this.myRepository.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id);
        }
        return null;
    }

}
