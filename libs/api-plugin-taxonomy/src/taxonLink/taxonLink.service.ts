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
        const { limit, offset, ...qParams } = params;

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            : this.myRepository.find({take: limit, skip: offset})
    }

    /*
    TODO: Not sure if this is implemented correctly.
     */
    async create(data: Partial<TaxonLink>): Promise<TaxonLink> {
        const taxon = this.myRepository.create(data);
        return this.myRepository.save(taxon);
    }

    /*
    TODO: Implement
     */
    async updateByID(id: number, data: Partial<TaxonLink>): Promise<TaxonLink> {
        const updateResult = await this.myRepository.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id);
        }
        return null;
    }

}
