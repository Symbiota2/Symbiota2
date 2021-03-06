import { Inject, Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { BaseService } from '@symbiota2/api-common'
import { TaxonDescriptionBlock, TaxonDescriptionStatement } from '@symbiota2/api-database';
import { TaxonDescriptionBlockFindAllParams } from './dto/taxonDescriptionBlock-find-all.input.dto'

@Injectable()
export class TaxonDescriptionBlockService extends BaseService<TaxonDescriptionBlock>{
    constructor(
        @Inject(TaxonDescriptionBlock.PROVIDER_ID)
        private readonly myRepository: Repository<TaxonDescriptionBlock>) {

        super(myRepository)
    }

    /*
    Fetch all of the descriptions.
    Can limit the list by a list of authority IDs.
    Can also limit the number fetched and use an offset.
     */
    async findAll(params?: TaxonDescriptionBlockFindAllParams): Promise<TaxonDescriptionBlock[]> {
        const { limit, offset, ...qParams } = params

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            : this.myRepository.find({take: limit, skip: offset})
    }

    /*
    Fetch the block data for a given taxon id.
    */
    async findBlockForTaxon(taxonID): Promise<TaxonDescriptionBlock> {
        return await
            this.myRepository.findOne({ relations: ["descriptionStatements"], where: { taxonID: taxonID}})
    }

    /*
Fetch the block data for a given taxon id.
*/
    async findBlockAndImagesForTaxon(taxonID): Promise<TaxonDescriptionBlock> {
        return await
            this.myRepository.findOne({
                relations: ["descriptionStatements","taxon","taxon.images"],
                where: { taxonID: taxonID}})
    }

    /*
    TODO: Not sure if this is implemented correctly.
     */
    async create(data: Partial<TaxonDescriptionBlock>): Promise<TaxonDescriptionBlock> {
        const taxon = this.myRepository.create(data)
        return this.myRepository.save(taxon)
    }

    /*
    TODO: Implement
     */
    async updateByID(id: number, data: Partial<TaxonDescriptionBlock>): Promise<TaxonDescriptionBlock> {
        const updateResult = await this.myRepository.update({ id }, data)
        if (updateResult.affected > 0) {
            return this.findByID(id)
        }
        return null
    }

}
