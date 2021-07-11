import { Inject, Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { BaseService } from '@symbiota2/api-common'
import { TaxonDescriptionBlock, TaxonDescriptionStatement } from '@symbiota2/api-database';
import { TaxonDescriptionStatementFindAllParams } from '../taxonDescriptionStatement/dto/taxonDescriptionStatement-find-all.input.dto';

@Injectable()
export class TaxonDescriptionStatementService extends BaseService<TaxonDescriptionStatement>{
    constructor(
        @Inject(TaxonDescriptionStatement.PROVIDER_ID)
        private readonly myRepository: Repository<TaxonDescriptionStatement>) {

        super(myRepository)
    }

    /*
    Fetch all of the taxonomic authorities.
    Can limit the list by a list of authority IDs.
    Can also limit the number fetched and use an offset.
     */
    async findAll(params?: TaxonDescriptionStatementFindAllParams): Promise<TaxonDescriptionStatement[]> {
        const { limit, offset, ...qParams } = params

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            : this.myRepository.find({take: limit, skip: offset})
    }



    /*
    TODO: Not sure if this is implemented correctly.
     */
    async create(data: Partial<TaxonDescriptionStatement>): Promise<TaxonDescriptionStatement> {
        const taxon = this.myRepository.create(data)
        return this.myRepository.save(taxon)
    }

    /*
    TODO: Implement
     */
    async updateByID(id: number, data: Partial<TaxonDescriptionStatement>): Promise<TaxonDescriptionStatement> {
        const updateResult = await this.myRepository.update({ id }, data)
        if (updateResult.affected > 0) {
            return this.findByID(id)
        }
        return null
    }

}
