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

    /*
    Find all of the taxonomic status records potentially using an optional list of taxon ids and a taxonomic authority id
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

    /*
  Find the children taxon using a taxon id and optionally a taxa authority id
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

    /*
    Find the children taxon using a taxon id and optionally a taxa authority id
     */
    async findChildren(taxonid: number, params?: TaxonomicStatusFindAllParams): Promise<TaxonomicStatus[]> {
        const { limit, offset, ...qParams } = params

        // The taxstatus table has a parenttid field
        // Fetch the children
        const children = await this.myRepository.find({relations: ["taxon"], where: {parentTaxonID: taxonid}})
        return children
    }

    /*
    Find one taxonomic status using a taxon id and a taxa authority id
    */
    async findOne(taxonid: number, taxonomicAuthorityID: number): Promise<TaxonomicStatus> {
        const status = await this.myRepository.findOne({
            relations: ["taxon"],
            where: {taxonID: taxonid, taxonAuthorityID: taxonomicAuthorityID}
        })
        return status
    }

    async create(data: Partial<TaxonomicStatus>): Promise<TaxonomicStatus> {
        const taxon = this.myRepository.create(data);
        return this.myRepository.save(taxon);
    }

    /*
    Update a taxon status record using a taxon id and authority id
    */
    async updateByID(taxonID: number, taxonAuthorityID:number, data: Partial<TaxonomicStatus>): Promise<TaxonomicStatus> {
        const updateResult = await this.myRepository.update({ taxonID, taxonAuthorityID }, data);
        if (updateResult.affected > 0) {
            return this.findOne(taxonID, taxonAuthorityID)
        }
        return null
    }

}
