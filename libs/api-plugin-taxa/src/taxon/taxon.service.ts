import { Inject, Injectable } from '@nestjs/common'
import { Taxon } from '@symbiota2/api-database'
import { In, Repository } from 'typeorm'
import { TaxonFindAllParams } from './dto/taxon-find-all.input.dto'
import { BaseService } from '@symbiota2/api-common'

@Injectable()
export class TaxonService extends BaseService<Taxon>{
    constructor(
        @Inject(Taxon.PROVIDER_ID)
        private readonly myRepository: Repository<Taxon>) {
        super(myRepository);
    }

    /*
    Service to find all of the taxons possibly using an array of ids and a taxonomic authority ID
     */
    async findAll(params?: TaxonFindAllParams): Promise<Taxon[]> {
        const { limit, offset, ...qParams } = params
        if (qParams.taxonAuthorityID) {
            // Have to use query builder since filter on nested relations does not work
            const qb = this.myRepository.createQueryBuilder('o')
                .innerJoin('o.taxonStatuses', 'c')
                .take(limit)
                .skip(offset)
                .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })

            if (qParams.id) {
                qb.andWhere('id IN :taxonIDs', {taxonIDs: params.id})
            }
            return qb.getMany()
        } else {
            // Can use nested relations
            return (qParams.id)?
                await this.myRepository.find({
                    take: limit,
                    skip: offset,
                    where: { id: In(params.id) }})
                : await this.myRepository.find({
                    take: limit,
                    skip: offset })
        }
    }

    /*
    Project the author and sciname from the taxa table using possibly a list of taxaIDs and an authority ID
     */
    async findAllScientificNamesPlusAuthors(params?: TaxonFindAllParams): Promise<Taxon[]> {
        const { limit, offset, ...qParams } = params
        if (qParams.taxonAuthorityID) {
            const qb = this.myRepository.createQueryBuilder('o')
                .select([
                    'o.scientificName',
                    'o.author'
                ])
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })

            if (qParams.id) {
                qb.andWhere('id IN :taxonIDs', {taxonIDs: params.id})
            }
            return qb.getMany()
        } else {
            return (qParams.id)?
                await this.myRepository.find({
                    select: ["scientificName", "author"],
                    take: limit,
                    skip: offset,
                    where: { id: In(params.id) }})
                : await this.myRepository.find({
                    select: ["scientificName", "author"],
                    take: limit,
                    skip: offset })
        }
    }

    /*
    Project the sciname from the taxa table using possibly a list of taxaIDs and an authority ID
     */
    async findAllScientificNames(params?: TaxonFindAllParams): Promise<Taxon[]> {
        //console.log("Taxon service: finding scientific names")
        const { limit, offset, ...qParams } = params

        if (qParams.taxonAuthorityID) {
            const qb = this.myRepository.createQueryBuilder('o')
                .select([
                    'o.scientificName'
                ])
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })

            if (qParams.id) {
                qb.andWhere('id IN :taxonIDs', {taxonIDs: params.id})
            }
            return qb.getMany()
        } else {
            return (qParams.id)?
                await this.myRepository.find({
                    select: ["scientificName"],
                    take: limit,
                    skip: offset,
                    where: { id: In(params.id) }})
                : await this.myRepository.find({
                    select: ["scientificName"],
                    take: limit,
                    skip: offset })
        }
            /*
            return (qParams.id)?
                await this.myRepository.find({
                    relations: ["taxonStatuses"],
                    select: ["scientificName"],
                    take: limit,
                    skip: offset,
                    where: { taxonStatuses: {taxonAuthorityID: params.taxonAuthorityID }, id: In(params.id) }})
                : await this.myRepository.find({
                    relations: ["taxonStatuses"],
                    select: ["scientificName"],
                    where: { taxonStatuses: {id: 3 }}
                    //take: limit,
                    //skip: offset
                    //where: { taxonStatuses: {taxonAuthorityID: params.taxonAuthorityID} }
                    //where: { 'Taxon__taxonStatuses.taxauthid': params.taxonAuthorityID }
                })
        } else {
            return (qParams.id)?
                await this.myRepository.find({
                    select: ["scientificName"],
                    take: limit,
                    skip: offset,
                    where: { id: In(params.id) }})
                : await this.myRepository.find({
                    select: ["scientificName"],
                    take: limit,
                    skip: offset })
        }

             */
    }

    /*
    Find all of the taxons that have a particular scientific name.
     */
    async findByScientificName(sciname: string, params?: TaxonFindAllParams): Promise<Taxon[]> {
        // const { limit, offset, ...qParams } = params;
        const { limit, offset, ...qParams } = params
        if (qParams.taxonAuthorityID) {
            // Have to use the query builder since where filter on nested relations does not work
            const qb = this.myRepository.createQueryBuilder('o')
                .select([
                    'o.scientificName'
                ])
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })
                .andWhere('o.scientificName = :sciname', {sciname: sciname})

            return qb.getMany()
        } else {
            return await this.myRepository.find({ where: { scientificName: sciname } })
        }
    }

    /*
    Find a taxon using a taxon ID.
     */
    async findByTID(id: number, params?: TaxonFindAllParams): Promise<Taxon> {
        const { limit, offset, ...qParams } = params
        return (qParams.taxonAuthorityID)?
            await this.myRepository.findOne({
                relations: ["taxonStatuses"],
                where: { taxonAuthorityID: params.taxonAuthorityID, id: id }})
            : this.myRepository.findOne({ where: {id: id} })
    }

    /*
    TODO: implement
     */
    async create(data: Partial<Taxon>): Promise<Taxon> {
        const taxon = this.myRepository.create(data);
        return this.myRepository.save(taxon);
    }

    /*
    Update a taxon record using a taxon id.
     */
    async updateByID(id: number, data: Partial<Taxon>): Promise<Taxon> {
        const updateResult = await this.myRepository.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id);
        }
        return null;
    }

}
