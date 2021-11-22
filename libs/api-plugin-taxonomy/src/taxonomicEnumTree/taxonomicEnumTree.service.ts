import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaxonomicEnumTreeFindAllParams } from './dto/taxonomicEnumTree-find-all.input.dto';
import { BaseService } from '@symbiota2/api-common';
import { TaxaEnumTreeEntry } from '@symbiota2/api-database';
//import { TaxonomicEnumTreeDto } from './dto/TaxonomicEnumTreeDto';
import {In} from "typeorm";
import { TaxonomicEnumTreeMoveTaxonParams } from './dto/taxonomicEnumTreeQueryParams';

@Injectable()
export class TaxonomicEnumTreeService extends BaseService<TaxaEnumTreeEntry>{
    constructor(
        @Inject(TaxaEnumTreeEntry.PROVIDER_ID)
        private readonly taxonomicEnumTrees: Repository<TaxaEnumTreeEntry>) {
        super(taxonomicEnumTrees)
    }

    /**
     * Get all of the taxon enum tree records (optionally narrow to a specific taxonomic
     * authority by id).
     * Can also limit the number fetched and use an offset.
     * Set find params using the 'TaxonomicEnumTreeFindAllParams'
     * @param params - the 'TaxonomicEnumTreeFindAllParams'
     * @returns Observable of response from api casted as `TaxaEnumTreeEntry[]`
     * will be the found enum tree entries
     * @returns `of(null)` if api errors or not found
     * @see TaxaEnumTreeEntry
     * @see TaxonomicEnumTreeFindAllParams
     */
    async findAll(params?: TaxonomicEnumTreeFindAllParams): Promise<TaxaEnumTreeEntry[]> {
        const { limit, offset, ...qParams } = params

        if (qParams.taxonAuthorityID) {
            return (qParams.taxonID) ?
                await this.taxonomicEnumTrees.find({
                    relations: ["parentTaxon", "taxon"],
                    take: limit,
                    skip: offset,
                    where: { taxonAuthorityID: params.taxonAuthorityID, taxonID: In(params.taxonID) }
                })
                : await this.taxonomicEnumTrees.find({
                    relations: ["parentTaxon", "taxon"],
                    take: limit,
                    skip: offset,
                    where: { taxonAuthorityID: params.taxonAuthorityID }
                })
        } else {
            return (qParams.taxonID) ?
                await this.taxonomicEnumTrees.find({
                    relations: ["parentTaxon", "taxon"],
                    take: limit,
                    skip: offset,
                    where: { taxonID: In(params.taxonID) }
                })
                : await this.taxonomicEnumTrees.find({
                    relations: ["parentTaxon", "taxon"],
                    take: limit,
                    skip: offset
                })
        }
    }

    /**
     * Find the descendants for a given taxon and taxon authority (which is optional, in
     * which case all are returned)
     * Set find params using the 'TaxonomicEnumTreeFindAllParams'
     * @param params - the 'TaxonomicEnumTreeFindAllParams'
     * @returns Observable of response from api casted as `TaxaEnumTreeEntry[]`
     * will be the found enum tree entries
     * @returns `of(null)` if api errors or not found
     * @see TaxaEnumTreeEntry
     * @see TaxonomicEnumTreeFindAllParams
     */
    async findDescendants(taxonid: string, params?: TaxonomicEnumTreeFindAllParams): Promise<TaxaEnumTreeEntry[]> {
        const { ...qParams } = params
        // Fetch the descendants
        return (qParams.taxonAuthorityID) ?
            await this.taxonomicEnumTrees.find({
                relations: ["taxon"],
                where: { taxonAuthorityID: params.taxonAuthorityID, parentTaxonID: taxonid}})
            : await this.taxonomicEnumTrees.find({
                relations: ["taxon"],
                where: { parentTaxonID: taxonid}})
    }

    /**
     * Find the descendants for a given taxon id, rank id, and taxon authority
     * (which is optional, in which case all are returned)
     * Only fetches the scientific name and the taxon id
     * Set find params using the 'TaxonomicEnumTreeFindAllParams'
     * @param taxonid - the id of the taxon
     * @param rankID - the id of the rank
     * @param params - the 'TaxonomicEnumTreeFindAllParams'
     * @returns Observable of response from api casted as `TaxaEnumTreeEntry[]`
     * will be the found enum tree entries
     * @returns `of(null)` if api errors or not found
     * @see TaxaEnumTreeEntry
     * @see TaxonomicEnumTreeFindAllParams
     */
    async findDescendantsByRank(taxonID: number, rankID: number, params?: TaxonomicEnumTreeFindAllParams): Promise<TaxaEnumTreeEntry[]> {
        const qb = this.taxonomicEnumTrees.createQueryBuilder('o')
            .select([
                'c.scientificName', 'o.taxonID'
            ])
            .innerJoin('o.taxon', 'c')
            .where('c.rankID = :rankID AND o.parentTaxonID = :parentTaxonID',
                { rankID: rankID, parentTaxonID: taxonID})

        // If authorityID is present use it
        if (params.taxonAuthorityID) {
            qb.andWhere('o.taxonomicAuthorityID = :authorityID',
                    { authorityID: params.taxonAuthorityID })
        }

        return await qb.getMany()
    }

    /**
     * Retrieve the ancestor records for a given taxon and taxon authority id
     * (which is optional, in which case for any taxon authority are returned)
     * Fetches the entire record
     * Set authority id as a param using the 'TaxonomicEnumTreeFindAllParams'
     * @param taxonID - the id of the taxon
     * @param params - the 'TaxonomicEnumTreeFindAllParams'
     * @returns Observable of response from api casted as `TaxaEnumTreeEntry[]`
     * will be the found enum tree entries
     * @returns `of(null)` if api errors or not found
     * @see TaxaEnumTreeEntry
     * @see TaxonomicEnumTreeFindAllParams
     */
    async findAncestors(taxonID: string, params?: TaxonomicEnumTreeFindAllParams): Promise<TaxaEnumTreeEntry[]> {
        const { ...qParams } = params

        // Fetch me, the underlying table stores a row for each tid/self->parenttid/ancestor relationship
        return (qParams.taxonAuthorityID) ?
            await this.taxonomicEnumTrees.find({
                relations: [
                    "parentTaxon",
                    "parentTaxon.acceptedTaxonStatuses",
                    "parentTaxon.acceptedTaxonStatuses.taxon"],
                where: {taxonAuthorityID: params.taxonAuthorityID, taxonID: taxonID}})
            : this.taxonomicEnumTrees.find({
                relations: [
                    "parentTaxon",
                    "parentTaxon.acceptedTaxonStatuses",
                    "parentTaxon.acceptedTaxonStatuses.taxon"],
                where: {taxonID: taxonID}})
    }

    /**
     * Retrieve the children records for a given taxon and taxon authority id
     * (which is optional, in which case for any taxon authority are returned)
     * Fetches the entire record + parent taxon + taxon
     * Set authority id as a param using the 'TaxonomicEnumTreeFindAllParams'
     * @param taxonID - the id of the taxon
     * @param params - the 'TaxonomicEnumTreeFindAllParams'
     * @returns Observable of response from api casted as `TaxaEnumTreeEntry[]`
     * will be the found enum tree entries
     * @returns `of(null)` if api errors or not found
     * @see TaxaEnumTreeEntry
     * @see TaxonomicEnumTreeFindAllParams
     */
    async findChildren(taxonid: number[], params?: TaxonomicEnumTreeFindAllParams): Promise<TaxaEnumTreeEntry[]> {
        const { ...qParams } = params

        // Fetch the children
        return (qParams.taxonAuthorityID) ?
            await this.taxonomicEnumTrees.find({
                relations: ["parentTaxon", "taxon"],
                where: {taxonAuthorityID: params.taxonAuthorityID, parentTaxonID: In(taxonid)}})
            : await this.taxonomicEnumTrees.find({
                relations: ["parentTaxon", "taxon"],
                where: {parentTaxonID: In(taxonid)}})

    }

    /**
     * Insert a taxonomic enum tree record using a Partial TaxaEnumTreeEntry record
     * @param data The Partial data for the record to create
     * @return number The created data or null (not found)
     */
    async save(data: Partial<TaxaEnumTreeEntry>): Promise<TaxaEnumTreeEntry> {
        return await this.taxonomicEnumTrees.save(data)
    }

    /**
     * Modify the taxa enum tree by moving a taxon within the tree.
     * Delete from the tree the records for the taxon
     * Insert into the tree the records for where the taxon moved to
     * @param params The TaxonomicEnumTreeMoveTaxonParams for the taxon to move
     * @return TaxaEnumTreeEntry One of the moved taxons or null (not found)
     * @see TaxaEnumTreeEntry
     * @see TaxonomicEnumTreeMoveTaxonParams
     */
    async moveTaxon(params: TaxonomicEnumTreeMoveTaxonParams): Promise<TaxaEnumTreeEntry> {
        const { ...qParams } = params

        console.log("moving " + qParams.taxonAuthorityID + " " + params.taxonID + " " + params.parentTaxonID)

        // First find all of the new parent's taxaEnum tree entries
        const entries =
            await this.taxonomicEnumTrees.find({
                where: {
                    taxonAuthorityID: params.taxonAuthorityID,
                    taxonID: params.parentTaxonID
                }})

        // Sanity check, don't delete if entry not found!
        if (!entries) return null

        // Delete the taxonID's taxaEnum tree entries
        await this.taxonomicEnumTrees.delete({
            taxonAuthorityID: params.taxonAuthorityID,
            taxonID: params.taxonID
        })

        // Update the enum tree pointing the taxonID to the new parent's ancestors
        entries.forEach((entry) => {
            entry.taxonID = params.taxonID
            entry.initialTimestamp = new Date()
            this.save(entry)
        })

        // Add the entry for taxon with the new parent
        const data = new TaxaEnumTreeEntry()
        data.parentTaxonID = params.parentTaxonID
        data.taxonID = params.taxonID
        data.taxonAuthorityID = params.taxonAuthorityID
        data.initialTimestamp = new Date()

        return this.save(data)
    }


}
