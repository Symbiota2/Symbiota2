import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaxonomicEnumTreeFindAllParams } from './dto/taxonomicEnumTree-find-all.input.dto';
import { BaseService } from '@symbiota2/api-common';
import { TaxaEnumTreeEntry } from '@symbiota2/api-database';
//import { TaxonomicEnumTreeDto } from './dto/TaxonomicEnumTreeDto';
import {In} from "typeorm";

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
                relations: ["parentTaxon", "taxon"],
                where: { taxonAuthorityID: params.taxonAuthorityID, parentTaxonID: taxonid}})
            : await this.taxonomicEnumTrees.find({
                relations: ["parentTaxon", "taxon"],
                where: { parentTaxonID: taxonid}})
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

    async create(data: Partial<TaxaEnumTreeEntry>): Promise<TaxaEnumTreeEntry> {
        const taxon = this.taxonomicEnumTrees.create(data)
        return this.taxonomicEnumTrees.save(taxon)
    }

    async updateByID(taxonID: number, data: Partial<TaxaEnumTreeEntry>): Promise<TaxaEnumTreeEntry> {
        const updateResult = await this.taxonomicEnumTrees.update({ taxonID }, data)
        if (updateResult.affected > 0) {
            return this.findByID(taxonID)
        }
        return null
    }

}
