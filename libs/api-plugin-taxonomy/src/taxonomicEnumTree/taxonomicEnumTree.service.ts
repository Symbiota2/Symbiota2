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

    /*
    Get all of the taxon enum tree records (optionally narrow to a specific taxonomic authority by id).
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

    /*
    Find the descendants for a given taxon and taxon authority (which is optional, in which case all are returned)
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

    /*
 Find the descendants for a given taxon id, rank id, and taxon authority (which is optional, in which case all are returned)
  */
    async findDescendantsByRank(taxonid: number, rankID: number, params?: TaxonomicEnumTreeFindAllParams): Promise<TaxaEnumTreeEntry[]> {
        const { ...qParams } = params
        const qb = this.taxonomicEnumTrees.createQueryBuilder('o')
            //.select(['o.*', 'c.*'])
            .select([
                'c.scientificName', 'o.taxonID'
            ])
            //.limit(params.limit || TaxonFindNamesParams.MAX_LIMIT) // TODO: set up a better way to lmiit
            .innerJoin('o.taxon', 'c')
            .where('c.rankID = :rankID AND o.parentTaxonID = :parentTaxonID',
                { rankID: 220, parentTaxonID: taxonid })

        /*
        if (qParams.taxonAuthorityID) {
            qb.innerJoin('c.taxonStatuses', 'd')
               .andWhere('d.taxonAuthorityID = :authorityID',
                { authorityID: params.taxonAuthorityID })
        }

         */

        return await qb.getMany()

    }

    /*
    Retrieve the ancestor records for a given taxon and taxon authority id (which is optional, in which case for any taxon authority are returned)
     */
    async findAncestors(taxonid: string, params?: TaxonomicEnumTreeFindAllParams): Promise<TaxaEnumTreeEntry[]> {
        const { ...qParams } = params

        // Fetch me, the underlying table stores a row for each tid/self->parenttid/ancestor relationship
        return (qParams.taxonAuthorityID) ?
            await this.taxonomicEnumTrees.find({
                relations: [
                    "parentTaxon",
                    "parentTaxon.acceptedTaxonStatuses",
                    "parentTaxon.acceptedTaxonStatuses.taxon"],
                where: {taxonAuthorityID: params.taxonAuthorityID, taxonID: taxonid}})
            : this.taxonomicEnumTrees.find({
                relations: [
                    "parentTaxon",
                    "parentTaxon.acceptedTaxonStatuses",
                    "parentTaxon.acceptedTaxonStatuses.taxon"],
                where: {taxonID: taxonid}})
    }

    /*
 Retrieve the ancestor records for a given taxon and taxon authority id (which is optional, in which case for any taxon authority are returned)
  */
    async findAncestors2(taxonid: string, params?: TaxonomicEnumTreeFindAllParams): Promise<TaxaEnumTreeEntry[]> {
        const { ...qParams } = params

        // Fetch me, the underlying table stores a row for each tid/self->parenttid/ancestor relationship
        return (qParams.taxonAuthorityID) ?
            await this.taxonomicEnumTrees.find({
                relations: [
                    "parentTaxon",
                    "parentTaxon.acceptedTaxonStatuses",
                    "parentTaxon.acceptedTaxonStatuses.taxon"],
                where: {taxonAuthorityID: params.taxonAuthorityID, taxonID: taxonid}})
            : await this.taxonomicEnumTrees.find({
                relations: [
                    "parentTaxon",
                    "parentTaxon.acceptedTaxonStatuses",
                    "parentTaxon.acceptedTaxonStatuses.taxon"],
                where: {taxonID: taxonid}})
    }

    /*
    TODO: Is this used?
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

    async save(data: Partial<TaxaEnumTreeEntry>): Promise<TaxaEnumTreeEntry> {
        return await this.taxonomicEnumTrees.save(data)
    }

    async moveTaxon(params: TaxonomicEnumTreeMoveTaxonParams): Promise<TaxaEnumTreeEntry> {
        const { ...qParams } = params

        console.log("moving " + qParams.taxonAuthorityID + " " + params.taxonID + " " + params.parentTaxonID)
        return null

        /*
        // Delete the taxonID's taxaEnum tree entries
        await this.taxonomicEnumTrees.delete({
            taxonAuthorityID: params.taxonAuthorityID,
            taxonID: params.taxonID
        })

        // Find all of the new parent's taxaEnum tree entries
        const entries =
            await this.taxonomicEnumTrees.find({
                where: {
                    taxonAuthorityID: params.taxonAuthorityID,
                    taxonID: params.parentTaxonID
                }})

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
         */
    }

    async updateByID(taxonID: number, data: Partial<TaxaEnumTreeEntry>): Promise<TaxaEnumTreeEntry> {
        const updateResult = await this.taxonomicEnumTrees.update({ taxonID }, data)
        if (updateResult.affected > 0) {
            return this.findByID(taxonID)
        }
        return null
    }

}
