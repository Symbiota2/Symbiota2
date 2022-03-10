import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { getManager, Not, Repository } from 'typeorm';
import { TaxonomicEnumTreeFindAllParams } from './dto/taxonomicEnumTree-find-all.input.dto';
import { BaseService } from '@symbiota2/api-common';
import { TaxaEnumTreeEntry, Taxon, TaxonomicStatus, TaxonomicUnit } from '@symbiota2/api-database';
//import { TaxonomicEnumTreeDto } from './dto/TaxonomicEnumTreeDto';
import {In} from "typeorm";
import { TaxonomicEnumTreeMoveTaxonParams } from './dto/taxonomicEnumTreeQueryParams';
import { TaxonService } from '../taxon/taxon.service';
import { TaxonomicStatusDto } from '../taxonomicStatus/dto/TaxonomicStatusDto';
import { TaxonDto } from '../taxon/dto/TaxonDto';
import { formatWithOptions } from 'util';

@Injectable()
export class TaxonomicEnumTreeService extends BaseService<TaxaEnumTreeEntry>{
    count = 0

    constructor(
        @Inject(TaxaEnumTreeEntry.PROVIDER_ID)
        private readonly enumTreeRepository: Repository<TaxaEnumTreeEntry>,
        @Inject(TaxonomicUnit.PROVIDER_ID)
        private readonly taxonomicUnitRepository: Repository<TaxonomicUnit>,
        @Inject(Taxon.PROVIDER_ID)
        private readonly taxonRepository: Repository<Taxon>,
        private readonly taxonService: TaxonService,
        @Inject(TaxonomicStatus.PROVIDER_ID)
        private readonly statusRepository: Repository<TaxonomicStatus>)
    {
        super(enumTreeRepository)
        this.count = 0
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
                await this.enumTreeRepository.find({
                    relations: ["parentTaxon", "taxon"],
                    take: limit,
                    skip: offset,
                    where: { taxonAuthorityID: params.taxonAuthorityID, taxonID: In(params.taxonID) }
                })
                : await this.enumTreeRepository.find({
                    relations: ["parentTaxon", "taxon"],
                    take: limit,
                    skip: offset,
                    where: { taxonAuthorityID: params.taxonAuthorityID }
                })
        } else {
            return (qParams.taxonID) ?
                await this.enumTreeRepository.find({
                    relations: ["parentTaxon", "taxon"],
                    take: limit,
                    skip: offset,
                    where: { taxonID: In(params.taxonID) }
                })
                : await this.enumTreeRepository.find({
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
    async findDescendants(taxonid: number, params?: TaxonomicEnumTreeFindAllParams): Promise<TaxaEnumTreeEntry[]> {
        const { ...qParams } = params
        // Fetch the descendants
        return (qParams.taxonAuthorityID) ?
            await this.enumTreeRepository.find({
                relations: ["taxon"],
                where: { taxonAuthorityID: params.taxonAuthorityID, parentTaxonID: taxonid}})
            : await this.enumTreeRepository.find({
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
        const qb = this.enumTreeRepository.createQueryBuilder('o')
            .select([
                'c.scientificName', 'o.taxonID'
            ])
            .innerJoin('o.taxon', 'c')
            .where('c.rankID = :rankID AND o.parentTaxonID = :parentTaxonID',
                { rankID: rankID, parentTaxonID: taxonID})

        // If authorityID is present use it
        if (params.taxonAuthorityID) {
            qb.andWhere('o.taxonAuthorityID = :authorityID',
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
            await this.enumTreeRepository.find({
                relations: [
                    "parentTaxon",
                    "parentTaxon.acceptedTaxonStatuses",
                    "parentTaxon.acceptedTaxonStatuses.taxon"],
                where: {taxonAuthorityID: params.taxonAuthorityID, taxonID: taxonID}})
            : this.enumTreeRepository.find({
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
            await this.enumTreeRepository.find({
                relations: ["parentTaxon", "taxon"],
                where: {taxonAuthorityID: params.taxonAuthorityID, parentTaxonID: In(taxonid)}})
            : await this.enumTreeRepository.find({
                relations: ["parentTaxon", "taxon"],
                where: {parentTaxonID: In(taxonid)}})

    }

    /**
     * Insert a taxonomic enum tree record using a Partial TaxaEnumTreeEntry record
     * @param data The Partial data for the record to create
     * @return number The created data or null (not found)
     */
    async save(data: Partial<TaxaEnumTreeEntry>): Promise<TaxaEnumTreeEntry> {
        return await this.enumTreeRepository.save(data)
    }

    /**
     * Delete all the enum tree records using a taxon id
     * @param taxonID The id of the taxon
     * @return TaxaEnumTreeEntry A fake enum tree entry if good else null (not found or api error)
     */
    async deleteByTaxonID(taxonID: number): Promise<TaxaEnumTreeEntry> {
        // Delete the taxonID's taxaEnum tree entries
        const deleteResult = await this.enumTreeRepository.delete({
            taxonID: taxonID
        })
        const deleteResult2 = await this.enumTreeRepository.delete({
            parentTaxonID: taxonID
        })

        if (deleteResult.affected > 0 || deleteResult2.affected > 0) {
            // return an empty taxonomic status
            return new TaxaEnumTreeEntry()
        }
        return null
    }



    /**
     * Modify the taxa enum tree by moving a taxon within the tree.
     * Delete from the tree the records for the taxon and its descendants
     * Insert into the tree the records for where the taxon moved to and
     * also update all of the descendents of the moved taxon
     * @param taxonID - the id of the taxon to move
     * @param taxonAuthorityID - the id of the taxa authority
     * @param parentTaxonID - the id of the taxon to move this taxon to
     * @return TaxaEnumTreeEntry One of the moved taxons or null (not found)
     * @see TaxaEnumTreeEntry
     */
    async moveTaxon(taxonID, taxonAuthorityID, parentTaxonID): Promise<TaxaEnumTreeEntry> {

        /*
        // [TODO wrap in a transaction? ]
        await getManager().transaction("SERIALIZABLE", entityManager => {

        })
         */

        // First find all of the new parent's taxaEnum tree entries
        const entries =
            await this.enumTreeRepository.find({
                where: {
                    taxonAuthorityID: taxonAuthorityID,
                    taxonID: parentTaxonID
                }})

        // Sanity check, don't delete if entry not found!
        if (!entries) return null

        // Next find all of the taxon to move's taxaEnum tree entries
        const ancestors =
            await this.enumTreeRepository.find({
                where: {
                    taxonAuthorityID: taxonAuthorityID,
                    taxonID: taxonID
                }})

        // Next get all of the descendant's of the current taxon
        const descendants =
            await this.enumTreeRepository.find( {
                where: {
                    taxonAuthorityID: taxonAuthorityID,
                    parentTaxonID: taxonID,
                    taxonID: Not(taxonID)
                }
            })

        // Delete the taxonID's taxaEnum tree entries
        await this.enumTreeRepository.delete({
            taxonAuthorityID: taxonAuthorityID,
            taxonID: taxonID
        })

        // Update the enum tree pointing the taxonID to the new parent's ancestors
        const buffer : Partial<TaxaEnumTreeEntry>[] = []
        entries.forEach((entry) => {
            const data = new TaxaEnumTreeEntry()
            data.parentTaxonID = entry.parentTaxonID
            data.taxonID = taxonID
            data.taxonAuthorityID = entry.taxonAuthorityID
            data.initialTimestamp = new Date()
            buffer.push(data)
        })

        // For all of the descendants, delete their relevant taxaEnum tree entries
        // and add the new ones
        await descendants.forEach((descendant) => {
            ancestors.forEach((ancestor) => {
                this.enumTreeRepository.delete( {
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
                buffer.push(data)
                //this.save(data)
            })
            // Add the entry for descendant with the new parent
            const data = new TaxaEnumTreeEntry()
            data.parentTaxonID = parentTaxonID
            data.taxonID = descendant.taxonID
            data.taxonAuthorityID = taxonAuthorityID
            data.initialTimestamp = new Date()
            buffer.push(data)
            //this.save(data)
        })

        // Add the entry for taxon with the new parent
        const data = new TaxaEnumTreeEntry()
        data.parentTaxonID = taxonID
        data.taxonID = taxonID
        data.taxonAuthorityID = taxonAuthorityID
        data.initialTimestamp = new Date()

        // Save the updates
        buffer.unshift(data)
        await this.enumTreeRepository.save(buffer)
        return data
    }

    /**
     * Build the taxa enum tree entries by processing all the taxon's at a given rank
     * @param rankID - the id of the rank
     * @param taxonAuthorityID - the id of the taxa authority
     */
    private async processRank(rankID, kingdomName, taxonAuthorityID) {
        // Fetch the statuses at this rank
        console.log(" rank is " + rankID)
        const statuses = (kingdomName) ?
            await this.statusRepository.find({
                where: {
                    taxon: {rankID: rankID, kingdomName: kingdomName},
                    // taxon: {rankID: rankID},
                    taxonAuthorityID: taxonAuthorityID
                    },
                relations: ["taxon"]
            })
            : await this.statusRepository.find({
                where: {
                    //taxon: {rankID: rankID, kingdomName: kingdomName},
                    taxon: {rankID: rankID},
                    taxonAuthorityID: taxonAuthorityID
                },
                relations: ["taxon"]
            })

        console.log("adding statuses " + statuses.length)
        // Add to the enum tree
        for (let status of statuses) {
            // Add the entry for taxon with the new parent
            const data = new TaxaEnumTreeEntry()
            data.parentTaxonID = status.parentTaxonID
            data.taxonID = status.taxonID
            data.taxonAuthorityID = taxonAuthorityID
            data.initialTimestamp = new Date()
            try {
                await this.save(data)
            } catch (err) {
                console.log("error is " + err)
            }

            // Add in the ancestors of the parent to this taxon's enum tree records
            await this.processAncestors(status.taxonID, status.parentTaxonID, taxonAuthorityID)
        }

    }

    /**
     * Build the taxa enum tree entries by copying the parent's enum records
     * Insert into the tree the records for taxon from the top rank to the bottom.
     * @param taxonID - the id of the taxon to add
     * @param parentTaxonID - the id of the taxon's parent
     * @param taxonAuthorityID - the id of the taxa authority
     */
    private async processAncestors(taxonID, parentTaxonID, taxonAuthorityID) {

        // Next find all of the taxon to move's taxaEnum tree entries
        const ancestors =
            await this.enumTreeRepository.find({
                where: {
                    taxonAuthorityID: taxonAuthorityID,
                    taxonID: parentTaxonID
                }})

        for (let ancestor of ancestors) {
            // Add the entry for taxonID with ancestor, but only if the parent is different
            // if (ancestor.parentTaxonID != parentTaxonID) {
                const data = new TaxaEnumTreeEntry()
                data.parentTaxonID = ancestor.parentTaxonID
                data.taxonID = taxonID
                data.taxonAuthorityID = taxonAuthorityID
                data.initialTimestamp = new Date()
                try {
                    await this.save(data)
                } catch (err) {
                    console.log("error is " + err)
                }
            //}
        }

    }

    /**
     * Rebuild the taxa enum tree from the top down.
     * Delete from the tree the all records.
     * Insert into the tree the records for taxon from the top rank to the bottom.
     * @param taxonAuthorityID - the id of the taxa authority
     * @return TaxaEnumTreeEntry One of the new enum records or null (not found)
     * @see TaxaEnumTreeEntry
     */
    async rebuildTaxonEnumTree(taxonAuthorityID: number): Promise<TaxaEnumTreeEntry> {
        // First let's load the taxonomic units
        /* If the taxon unit table is fine, use this one
        const units : TaxonomicUnit[] = await this.taxonomicUnitRepository.find({})
         */
        const units = await this.taxonRepository.createQueryBuilder('s')
            .select('s.rankID as rank')
            .distinct(true)
            .getRawMany()

        units.sort((i,j) => {
            return i.rank - j.rank
        })

        // Sort the units based on the kingdom name and the unit it
        /* If the taxon unit table is fine, use this one
        units.sort((i,j) => {
            if (i.kingdomName > j.kingdomName) {
                return 1
            } else if (i.kingdomName < j.kingdomName) {
                return -1
            } else {
                // Same kingdom
                return i.rankID - j.rankID
            }
        })
         */

        // Drop everything in the taxaenumtree table for this authorityID
        await this.enumTreeRepository.delete({
            taxonAuthorityID: taxonAuthorityID
        })

        // Now iterate through the ranks, adding all for a given rank to the table
        for (let unit of units) {
            // if taxon units foreign key works
            //this.processRank(unit.rankID, unit.kingdomName, taxonAuthorityID)

            // Otherwise, ignore the kingdom
            await this.processRank(unit.rank,null, taxonAuthorityID)
        }
        return new TaxaEnumTreeEntry()
    }

}
