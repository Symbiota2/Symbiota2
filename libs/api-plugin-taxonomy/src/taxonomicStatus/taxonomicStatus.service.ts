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
     * @param acceptedID - the id of the accepted taxon
     * @returns Observable of response from api casted as `TaxonomicStatus`
     * will be the found status
     * @returns `of(null)` if api errors or not found
     * @see TaxonomicStatus
     */
    async findOne(taxonid: number, taxonomicAuthorityID: number, acceptedID: number): Promise<TaxonomicStatus> {
        const status = await this.myRepository.findOne({
            relations: ["taxon"],
            where: {taxonID: taxonid, taxonAuthorityID: taxonomicAuthorityID, taxonIDAccepted: acceptedID}
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
     * Change taxonomic status to accepted for a taxon id and a taxon authority id.
     * @param taxonID The id of the taxon to make accepted
     * @param taxonAuthorityID The id of the taxonomic authority
     * @return TaxonomicStatus The new taxon's status or null (not found or api error)
     */
    async updateToAccepted(
        taxonID: number,
        taxonAuthorityID:number
    ): Promise<TaxonomicStatus> {

        const status = await this.myRepository.update(
            { taxonID: taxonID, taxonAuthorityID: taxonAuthorityID },
            { taxonIDAccepted: taxonID }
        )
        if (status.affected > 0) {
            return this.findOne(taxonID, taxonAuthorityID, taxonID)
        }
        return null
    }

    /**
     * Returns a list of the fields of the taxon status entity
     */
    getFields(): string[] {
        const entityColumns = this.myRepository.metadata.columns;
        return entityColumns.map((c) => c.propertyName);
    }

    /**
     * Change accepted status in a ring using a new taxon accepted id and and old taxon accepted
     * and a taxon authority id.
     * @param newTaxonID The id of the taxon to make accepted
     * @param oldTaxonID The id of the taxon to make not accepted
     * @param taxonAuthorityID The id of the taxonomic authority
     * @return TaxonomicStatus The new taxon's status or null (not found or api error)
     */
    async updateAcceptedRing(
        newTaxonID: number,
        taxonAuthorityID:number,
        oldTaxonID: number
    ): Promise<TaxonomicStatus> {

        const ring = await this.myRepository.update(
            { taxonIDAccepted: oldTaxonID, taxonAuthorityID: taxonAuthorityID },
            { taxonIDAccepted: newTaxonID }
        )
        if (ring.affected > 0) {
            return this.findOne(newTaxonID, taxonAuthorityID, newTaxonID)
        }
        return null
    }

    /**
     * Update a taxon record using a taxon id and authority id.
     * @param taxonID The id of the taxon
     * @param taxonAuthorityID The id of the taxonomic authority
     * @param acceptedID The id of the accepted id
     * @param data The data to update
     * @return TaxonomicStatus The updated data or null (not found or api error)
     */
    async updateByKey(taxonID: number, taxonAuthorityID:number, acceptedID: number, data: Partial<TaxonomicStatus>): Promise<TaxonomicStatus> {
        const updateResult = await this.myRepository.update({
            taxonID : taxonID, taxonAuthorityID: taxonAuthorityID, taxonIDAccepted: acceptedID
        }, data)
        if (updateResult.affected > 0) {
            return this.findOne(taxonID, taxonAuthorityID, acceptedID)
        }
        return null
    }

    /**
     * Delete a taxon record using a taxon id, authority id, and accepted id (key of table)
     * @param taxonID The id of the taxon
     * @param taxonAuthorityID The id of the taxonomic authority
     * @param acceptedID The id of the accepted taxon
     * @return TaxonomicStatus A fake taxonomic status if good else null (not found or api error)
     */
    async deleteByKey(taxonID: number, taxonAuthorityID:number, acceptedID: number): Promise<TaxonomicStatus> {
        const deleteResult = await this.myRepository.delete({
            taxonID : taxonID, taxonAuthorityID: taxonAuthorityID, taxonIDAccepted: acceptedID
        })
        if (deleteResult.affected > 0) {
            // return an empty taxonomic status
            return new TaxonomicStatus()
        }
        return null
    }

}
