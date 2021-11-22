import { Inject, Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { BaseService } from '@symbiota2/api-common'
import { TaxonDescriptionBlock, TaxonDescriptionStatement } from '@symbiota2/api-database';
import { TaxonDescriptionBlockFindAllParams } from './dto/taxonDescriptionBlock-find-all.input.dto'
import { TaxonDescriptionBlockInputDto } from './dto/TaxonDescriptionBlockInputDto';

@Injectable()
export class TaxonDescriptionBlockService extends BaseService<TaxonDescriptionBlock>{
    constructor(
        @Inject(TaxonDescriptionBlock.PROVIDER_ID)
        private readonly myRepository: Repository<TaxonDescriptionBlock>) {

        super(myRepository)
    }

    /**
     * Fetch all of the taxonomic description blocks meeting some conditions.
     * Can limit the list by a list of authority IDs.
     * Can also limit the number fetched and use an offset.
     * Set find params using the 'TaxonDescriptionBlockFindAllParams'
     * @param params - the 'TaxonDescriptionBlockFindAllParams'
     * @returns Observable of response from api casted as `TaxonDescriptionBlock[]`
     * will be the found blocks
     * @returns `of(null)` if api errors
     * @see TaxonDescriptionBlock
     * @see TaxonDescriptionBlockFindAllParams
     */
    async findAll(params?: TaxonDescriptionBlockFindAllParams): Promise<TaxonDescriptionBlock[]> {
        const { limit, offset, ...qParams } = params

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            : this.myRepository.find({take: limit, skip: offset})
    }

    /**
     * Fetch the block data for a given taxon id.
     * @param taxonID - the id of the taxon
     * @returns Observable of response from api casted as `TaxonDescriptionBlock[]`
     * will be the found blocks
     * @returns `of(null)` if api errors
     * @see TaxonDescriptionBlock
     */
    async findBlocksForTaxon(taxonID): Promise<TaxonDescriptionBlock[]> {
        return await
            this.myRepository.find({ relations: ["descriptionStatements"], where: { taxonID: taxonID}})
    }

    /**
     * Fetch the block data and the image data associated with those blocks for a given taxon id.
     * @param taxonID - the id of the taxon
     * @returns Observable of response from api casted as `TaxonDescriptionBlock[]`
     * will be the found blocks
     * @returns `of(null)` if api errors
     * @see TaxonDescriptionBlock
     */
    async findBlocksAndImagesForTaxon(taxonID): Promise<TaxonDescriptionBlock[]> {
        return await
            this.myRepository.find({
                relations: ["descriptionStatements","taxon","taxon.images"],
                where: { taxonID: taxonID}})
    }

    /**
     * Create a taxon description block, inserting into database
     * @param data - data for the inserted block
     * @returns Observable of response from api casted as `TaxonDescriptionBlock`
     * will be the inserted block
     * @returns `of(null)` if api errors
     * @see TaxonDescriptionBlock
     */
    async create(data: Partial<TaxonDescriptionBlockInputDto>): Promise<TaxonDescriptionBlock> {
        return this.myRepository.save(data)
    }

    /**
     * Update a taxon description block
     * @param id - id of taxon description block to update
     * @param data - data for the updated block
     * @returns Observable of response from api casted as `TaxonDescriptionBlock`
     * will be the updated block
     * @returns `of(null)` if api errors or id not found
     * @see TaxonDescriptionBlock
     */
    async updateByID(id: number, data: Partial<TaxonDescriptionBlock>): Promise<TaxonDescriptionBlock> {
        const updateResult = await this.myRepository.update({ id }, data)
        if (updateResult.affected > 0) {
            return this.findByID(id)
        }
        return null
    }

}
