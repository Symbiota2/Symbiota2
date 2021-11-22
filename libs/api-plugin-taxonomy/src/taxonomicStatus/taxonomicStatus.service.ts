import { Inject, Injectable } from '@nestjs/common'
import { In, Repository, Not } from 'typeorm'
import { TaxonomicStatusFindAllParams } from './dto/taxonomicStatus-find-all.input.dto'
import { BaseService } from '@symbiota2/api-common'
import { Taxon, TaxonomicStatus } from '@symbiota2/api-database';

@Injectable()
export class TaxonomicStatusService extends BaseService<TaxonomicStatus>{
    constructor(
        @Inject(TaxonomicStatus.PROVIDER_ID)
        private readonly myRepository: Repository<TaxonomicStatus>) {

        super(myRepository);
    }

    /**
     * Find all of the taxonomic status records potentially using an optional list of taxon
     * ids and a taxonomic authority id
     * Can also limit the number fetched and use an offset.
     * Set find params using the 'TaxonomicStatusFindAllParams'
     * @param params - the 'TaxonomicStatusFindAllParams'
     * @returns Observable of response from api casted as `TaxonomicStatus[]`
     * will be the found statuses
     * @returns `of(null)` if api errors or not found
     * @see TaxonomicStatus
     * @see TaxonomicStatusFindAllParams
     */
    async findAll(params?: TaxonomicStatusFindAllParams): Promise<TaxonomicStatus[]> {
        const { limit, offset, ...qParams } = params;

        return (qParams.taxonAuthorityID) ?
            (qParams.id) ?
                await this.myRepository.find({
                    relations: ["parentTaxon", "taxon"],
                    where: { taxonAuthorityID: params.taxonAuthorityID, taxonID: In(params.id)}})
                : await this.myRepository.find({
                    relations: ["parentTaxon", "taxon"],
                    take: limit,
                    skip: offset,
                    where: { taxonAuthorityID: params.taxonAuthorityID}})
            : (qParams.id) ?
                await this.myRepository.find({relations: ["parentTaxon", "taxon"], where: { taxonID: In(params.id)}})
                : await this.myRepository.find({relations: ["parentTaxon", "taxon"], take: limit, skip: offset})
    }

    /**
     * Find all of the taxonomic status synonyms for a given taxon id
     * Optionally use a taxonomic authority id (probably should in all cases)
     * Set find params using the 'TaxonomicStatusFindAllParams'
     * @param id - the taxon id
     * @param params - the 'TaxonomicStatusFindAllParams'
     * @returns Observable of response from api casted as `TaxonomicStatus[]`
     * will be the found statuses
     * @returns `of(null)` if api errors or not found
     * @see TaxonomicStatus
     * @see TaxonomicStatusFindAllParams
     */
    async findSynonyms(taxonid: number, params?: TaxonomicStatusFindAllParams): Promise<TaxonomicStatus[]> {
        const { limit, offset, ...qParams } = params

        // A potential synonym has the tidaccepted of the tid
        const synonyms = await this.myRepository.find(
            {relations: ["taxon"],
                where: {taxonIDAccepted: taxonid, taxonID: Not(taxonid)}}
        )
        return synonyms
    }

    /**
     * Find the children taxonomic statuses using a taxon id
     * Optionally use a taxonomic authority id (probably should in all cases)
     * Set find params using the 'TaxonomicStatusFindAllParams'
     * @param id - the taxon id
     * @param params - the 'TaxonomicStatusFindAllParams'
     * @returns Observable of response from api casted as `TaxonomicStatus[]`
     * will be the found statuses
     * @returns `of(null)` if api errors or not found
     * @see TaxonomicStatus
     * @see TaxonomicStatusFindAllParams
     */
    async findChildren(taxonid: number, params?: TaxonomicStatusFindAllParams): Promise<TaxonomicStatus[]> {
        const { limit, offset, ...qParams } = params

        // The taxstatus table has a parenttid field
        // Fetch the children
        const children = await this.myRepository.find({
                relations: ["taxon"],
                where: {parentTaxonID: taxonid}
            })
        return children
    }

    /**
     * Find one taxonomic status using a taxon id and a taxa authority id
     * @param taxonid - the taxon id
     * @param taxonomicAuthorityID - the authority id
     * @returns Observable of response from api casted as `TaxonomicStatus`
     * will be the found status
     * @returns `of(null)` if api errors or not found
     * @see TaxonomicStatus
     */
    async findOne(taxonid: number, taxonomicAuthorityID: number): Promise<TaxonomicStatus> {
        const status = await this.myRepository.findOne({
            relations: ["taxon"],
            where: {taxonID: taxonid, taxonAuthorityID: taxonomicAuthorityID}
        })
        return status
    }

    /**
     * Create a taxonomic status record using a Partial TaxonomicStatus record
     * @param data The Partial data for the record to create
     * @return number The created data or null (not found)
     */
    async create(data: Partial<TaxonomicStatus>): Promise<TaxonomicStatus> {
        const taxon = this.myRepository.create(data);
        return this.myRepository.save(taxon);
    }

    /**
     * Update a taxon record using a taxon id and authority id.
     * @param taxonID The id of the taxon
     * @param taxonAuthorityID The id of the taxonomic authority
     * @param data The data to update
     * @return TaxonomicStatus The updated data or null (not found or api error)
     */
    async updateByID(taxonID: number, taxonAuthorityID:number, data: Partial<TaxonomicStatus>): Promise<TaxonomicStatus> {
        const updateResult = await this.myRepository.update({ taxonID, taxonAuthorityID }, data);
        if (updateResult.affected > 0) {
            return this.findOne(taxonID, taxonAuthorityID)
        }
        return null
    }

}
