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

    /**
     * Fetch all of the taxonomic description statements meeting some conditions.
     * Can limit the list by a list of authority IDs.
     * Can also limit the number fetched and use an offset.
     * Set find params using the 'TaxonDescriptionStatementFindAllParams'
     * @param params - the 'TaxonDescriptionStatementFindAllParams'
     * @returns Observable of response from api casted as `TaxonDescriptionStatement[]`
     * will be the found statements
     * @returns `of(null)` if api errors
     * @see TaxonDescriptionStatement
     * @see TaxonDescriptionStatementFindAllParams
     */
    async findAll(params?: TaxonDescriptionStatementFindAllParams): Promise<TaxonDescriptionStatement[]> {
        const { limit, offset, ...qParams } = params

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            : this.myRepository.find({take: limit, skip: offset})
    }

    /**
     * Create a taxon description statement, inserting into database
     * @param data - data for the inserted statement
     * @returns Observable of response from api casted as `TaxonDescriptionStatement`
     * will be the inserted statement
     * @returns `of(null)` if api errors
     * @see TaxonDescriptionStatement
     */
    async create(data: Partial<TaxonDescriptionStatement>): Promise<TaxonDescriptionStatement> {
        // fill in fields that need a default value
        if (!data.heading) {
            data.heading = ""
        }
        if (!data.statement) {
            data.statement = ""
        }
        const taxon = this.myRepository.create(data)
        return this.myRepository.save(taxon)
    }

    /**
     * Update a taxon description statement
     * @param id - id of taxon description statement to update
     * @param data - data for the updated statement
     * @returns Observable of response from api casted as `TaxonDescriptionStatement`
     * will be the updated statement
     * @returns `of(null)` if api errors or id not found
     * @see TaxonDescriptionStatement
     */
    async updateByID(id: number, data: Partial<TaxonDescriptionStatement>): Promise<TaxonDescriptionStatement> {
        const updateResult = await this.myRepository.update({ id }, data)
        if (updateResult.affected > 0) {
            return this.findByID(id)
        }
        return null
    }

}
