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
    async findBlocksForTaxon(taxonID): Promise<TaxonDescriptionBlock[]> {
        return await
            this.myRepository.find({ relations: ["descriptionStatements"], where: { taxonID: taxonID}})
    }

    /*
Fetch the block data for a given taxon id.
*/
    async findBlocksAndImagesForTaxon(taxonID): Promise<TaxonDescriptionBlock[]> {
        return await
            this.myRepository.find({
                relations: ["descriptionStatements","taxon","taxon.images"],
                where: { taxonID: taxonID}})
    }

    /*
    Create a taxon description block
     */
    async create(data: Partial<TaxonDescriptionBlockInputDto>): Promise<TaxonDescriptionBlock> {
        //const block = this.myRepository.create(data)
        data.creatorUID = 1 //[TODO: Why do I always need to set this to 1, it is null coming in?]
        console.log(" data is id " + data.id)
        return this.myRepository.save(data)
    }

    /*
    Update a taxon description block
     */
    async updateByID(id: number, data: Partial<TaxonDescriptionBlock>): Promise<TaxonDescriptionBlock> {
        const updateResult = await this.myRepository.update({ id }, data)
        if (updateResult.affected > 0) {
            return this.findByID(id)
        }
        return null
    }

}
