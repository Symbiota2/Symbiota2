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
     * Recursively move all of the children
     * @param taxonID - the id of the taxon to move
     * @param taxonAuthorityID - the id of the taxa authority
     * @param parentTaxonID - the id of the taxon to move this taxon to
     * @return TaxaEnumTreeEntry One of the moved taxons or null (not found)
     * @see TaxaEnumTreeEntry
     */
    async moveTaxon(taxonID, taxonAuthorityID, parentTaxonID): Promise<TaxaEnumTreeEntry> {

        // [TODO wrap in a transaction? ]
        //console.log("moving " + taxonAuthorityID + " " + taxonID + " " + parentTaxonID)

        // First find all of the new parent's taxaEnum tree entries
        const entries =
            await this.taxonomicEnumTrees.find({
                where: {
                    taxonAuthorityID: taxonAuthorityID,
                    taxonID: parentTaxonID
                }})

        // Sanity check, don't delete if entry not found!
        if (!entries) return null

        // Next find all of the taxon to move's taxaEnum tree entries
        const ancestors =
            await this.taxonomicEnumTrees.find({
                where: {
                    taxonAuthorityID: taxonAuthorityID,
                    taxonID: taxonID
                }})

        // Next get all of the descendant's of the current taxon
        const descendants =
            await this.taxonomicEnumTrees.find( {
                where: {
                    taxonAuthorityID: taxonAuthorityID,
                    parentTaxonID: taxonID
                }
            })

        // Delete the taxonID's taxaEnum tree entries
        //console.log(" deleting where taxonID " + taxonID + " authority " + taxonAuthorityID)
        await this.taxonomicEnumTrees.delete({
            taxonAuthorityID: taxonAuthorityID,
            taxonID: taxonID
        })

        // Update the enum tree pointing the taxonID to the new parent's ancestors
        await entries.forEach((entry) => {
            const data = new TaxaEnumTreeEntry()
            data.parentTaxonID = entry.parentTaxonID
            data.taxonID = taxonID
            data.taxonAuthorityID = entry.taxonAuthorityID
            data.initialTimestamp = new Date()
            //console.log(" updating where taxonID " + taxonID + " authority " + entry.taxonAuthorityID + " parent " + entry.parentTaxonID)
            this.save(data)
        })

        // For all of the descendants, delete their relevant taxaEnum tree entries
        // and add the new ones
        await descendants.forEach((descendant) => {
            ancestors.forEach((ancestor) => {
                //console.log(" deleting desc where taxonID " + descendant.taxonID + " authority " + taxonAuthorityID + " parent " + ancestor.parentTaxonID)
                this.taxonomicEnumTrees.delete( {
                    taxonAuthorityID: taxonAuthorityID,
                    taxonID: descendant.taxonID,
                    parentTaxonID: ancestor.parentTaxonID
                })
            })
        })

        // Need to do two loops to let the deletes finish before the inserts
        await descendants.forEach((descendant) => {
            entries.forEach((entry) => {
                const data = new TaxaEnumTreeEntry()
                data.parentTaxonID = entry.parentTaxonID
                data.taxonID = descendant.taxonID
                data.taxonAuthorityID = entry.taxonAuthorityID
                data.initialTimestamp = new Date()
                //console.log(" saving desc where taxonID " + entry.taxonID + " authority " + entry.taxonAuthorityID + " parent " + entry.parentTaxonID)
                this.save(data)
            })
            // Add the entry for descendant with the new parent
            const data = new TaxaEnumTreeEntry()
            data.parentTaxonID = parentTaxonID
            data.taxonID = descendant.taxonID
            data.taxonAuthorityID = taxonAuthorityID
            data.initialTimestamp = new Date()
            //console.log(" saving self desc where taxonID " + descendant.taxonID + " authority " + taxonAuthorityID + " parent " + parentTaxonID)
            this.save(data)
        })

        // Add the entry for taxon with the new parent
        const data = new TaxaEnumTreeEntry()
        data.parentTaxonID = parentTaxonID
        data.taxonID = taxonID
        data.taxonAuthorityID = taxonAuthorityID
        data.initialTimestamp = new Date()
        //console.log(" saving self where taxonID " + taxonID + " authority " + taxonAuthorityID + " parent " + parentTaxonID)
        return this.save(data)
    }
}
