import { Inject, Injectable } from '@nestjs/common'
import { Taxon, TaxonomicUnit } from '@symbiota2/api-database';
import { In, Like, Repository } from 'typeorm';
import { TaxonFindAllParams } from './dto/taxon-find-all.input.dto'
import { BaseService } from '@symbiota2/api-common'
import { TaxonFindNamesParams } from './dto/taxon-find-names.input.dto';

@Injectable()
export class TaxonService extends BaseService<Taxon>{
    constructor(
        @Inject(Taxon.PROVIDER_ID)
        private readonly taxonRepo: Repository<Taxon>) {
        super(taxonRepo);
    }

    /*
    Service to find all of the taxons possibly using an array of ids and a taxonomic authority ID
     */
    async findAll(params?: TaxonFindAllParams): Promise<Taxon[]> {
        const { limit, offset, ...qParams } = params

        if (qParams.taxonAuthorityID) {
            // Have to use query builder since filter on nested relations does not work
            const qb = this.taxonRepo.createQueryBuilder('o')
                .leftJoin('o.taxonStatuses', 'c')
                //.take(limit)

                .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })

            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            } else {
                // limit only if we don't have a list of ids
                qb.take(limit)
                qb.skip(offset)
            }
            return qb.getMany()
        } else {
            // Can use nested relations
            return (qParams.id)?
                await this.taxonRepo.find({
                    // No limit or offset if we have a list of ids
                    // take: limit,
                    // skip: offset,
                    where: { id: In(params.id) }})
                : await this.taxonRepo.find({
                    take: limit,
                    skip: offset })
        }
    }

    /*
    Project the author and sciname from the taxa table using possibly a list of taxaIDs and an authority ID
     */
    async findAllScientificNamesPlusAuthors(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        const { limit,...qParams } = params
        if (qParams.taxonAuthorityID) {
            const qb = this.taxonRepo.createQueryBuilder('o')
                .select([
                    'o.scientificName',
                    'o.author'
                ])
                .limit(params.limit || TaxonFindNamesParams.MAX_LIMIT) // TODO: set up a better way to lmiit
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })

            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            }

            if (qParams.partialName) {
                qb.andWhere('o.scientificName LIKE :name', {name: params.partialName + '%'})
            }
            return await qb.getMany()
        } else {
            return (qParams.id)?
                await this.taxonRepo.find({
                    select: ["scientificName", "author"],
                    where: { id: In(params.id) },
                    take: TaxonFindAllParams.MAX_LIMIT})
                : await this.taxonRepo.find({
                    select: ["scientificName", "author"],
                    take: TaxonFindAllParams.MAX_LIMIT
                })
        }
    }

    /*
 Project the sciname from the taxa table using possibly a list of taxaIDs and an authority ID
  */
    async findAllScientificNames(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        //console.log("Taxon service: finding scientific names")
        const { limit,...qParams } = params

        if (qParams.taxonAuthorityID) {
            const qb = this.taxonRepo.createQueryBuilder('o')
                .select([
                    'o.scientificName'
                ])
                .limit(params.limit || TaxonFindNamesParams.MAX_LIMIT) // TODO: set up a better way to lmiit
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })

            if (qParams.partialName) {
                qb.andWhere('o.scientificName LIKE :name', {name: params.partialName + '%'})
            }
            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            }
            return await qb.getMany()
        } else {
            return (qParams.id)?
                await this.taxonRepo.find({
                    select: ["scientificName"],
                    where: { id: In(params.id) },
                    take: TaxonFindAllParams.MAX_LIMIT})
                : await this.taxonRepo.find({
                    select: ["scientificName"],
                    take: TaxonFindAllParams.MAX_LIMIT
                })
        }
    }

    /*
    Project the sciname from the taxa table for the rank of family using possibly a list of taxaIDs
    and an authority ID
     */
    async findFamilyNames(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        //console.log("Taxon service: finding scientific names")
        const { limit,...qParams } = params

        if (qParams.taxonAuthorityID) {
            const qb = this.taxonRepo.createQueryBuilder('o')
                .select([
                    'o.scientificName', 'o.id'
                ])
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID',
                    { authorityID: params.taxonAuthorityID })
                .andWhere('c.rankID = :rankID',
                    { rankID: 140 })

            if (qParams.partialName) {
                qb.andWhere('o.scientificName LIKE :name', {name: params.partialName + '%'})
            }
            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            }
            return await qb.getMany()
        } else {
            return (qParams.id)?
                await this.taxonRepo.find({
                    select: ["scientificName", "id"],
                    where: { id: In(params.id), rankID: 140 }
                    // take: TaxonFindAllParams.MAX_LIMIT
                })
                : await this.taxonRepo.find({
                    select: ["scientificName","id"],
                    where: { rankID: 140 }
                   // take: TaxonFindAllParams.MAX_LIMIT
                })
        }
    }

    /*
Project the sciname from the taxa table for the rank of genus using possibly a list of taxaIDs
and an authority ID
 */
    async findGenusNames(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        //console.log("Taxon service: finding scientific names")
        const { limit,...qParams } = params

        if (qParams.taxonAuthorityID) {
            const qb = this.taxonRepo.createQueryBuilder('o')
                .select([
                    'o.scientificName','o.id'
                ])
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID',
                    { authorityID: params.taxonAuthorityID })
                .andWhere('c.rankID = :rankID',
                    { rankID: 180 })

            if (qParams.partialName) {
                qb.andWhere('o.scientificName LIKE :name', {name: params.partialName + '%'})
            }
            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            }
            return await qb.getMany()
        } else {
            return (qParams.id)?
                await this.taxonRepo.find({
                    select: ["scientificName", "id"],
                    where: { id: In(params.id), rankID: 180 }
                    //take: TaxonFindAllParams.MAX_LIMIT
                })
                : await this.taxonRepo.find({
                    select: ["scientificName","id"],
                    where: { rankID: 180 }
                    //take: TaxonFindAllParams.MAX_LIMIT
                })
        }
    }

    /*
Project the sciname from the taxa table for the rank of species using possibly a list of taxaIDs
and an authority ID
 */
    async findSpeciesNames(params?: TaxonFindNamesParams): Promise<Taxon[]> {
        //console.log("Taxon service: finding scientific names")
        const { limit,...qParams } = params

        if (qParams.taxonAuthorityID) {
            const qb = this.taxonRepo.createQueryBuilder('o')
                .select([
                    'o.scientificName', 'o.id'
                ])
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID',
                    { authorityID: params.taxonAuthorityID })
                .andWhere('c.rankID = :rankID',
                    { rankID: 220 })

            if (qParams.partialName) {
                qb.andWhere('o.scientificName LIKE :name', {name: params.partialName + '%'})
            }
            if (qParams.id) {
                qb.andWhere('o.id IN (:...taxonIDs)', {taxonIDs: params.id})
            }
            return await qb.getMany()
        } else {
            return (qParams.id)?
                (qParams.partialName)?
                    await this.taxonRepo.find({
                        select: ["scientificName", "id"],
                        where: { id: In(params.id),
                            rankID: 220,
                            scientificName: Like(params.partialName + '%') }
                        //take: TaxonFindAllParams.MAX_LIMIT
                    })
                    : await this.taxonRepo.find({
                        select: ["scientificName", "id"],
                        where: { id: In(params.id), rankID: 220 }
                        //take: TaxonFindAllParams.MAX_LIMIT
                    })
                : (qParams.partialName)?
                    await this.taxonRepo.find({
                        select: ["scientificName","id"],
                        where: {
                            rankID: 220,
                            scientificName: Like(params.partialName + '%')
                        }
                        //take: TaxonFindAllParams.MAX_LIMIT
                    })
                    : await this.taxonRepo.find({
                        select: ["scientificName","id"],
                        where: { rankID: 220 }
                        //take: TaxonFindAllParams.MAX_LIMIT
                    })
        }
    }

    /*
    Find all of the taxons that have a particular scientific name.
     */
    async findByScientificName(sciname: string, params?: TaxonFindNamesParams): Promise<Taxon[]> {
        const { ...qParams } = params
        if (qParams.taxonAuthorityID) {
            // Have to use the query builder since where filter on nested relations does not work
            const qb = this.taxonRepo.createQueryBuilder('o')
                .innerJoin('o.taxonStatuses', 'c')
                .where('c.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })
                .andWhere('o.scientificName = :sciname', {sciname: sciname})

            return await qb.getMany()
        } else {
            return await this.taxonRepo.find({ where: { scientificName: sciname } })
        }
    }

    /*
    Find a taxon and its synonyms using a taxon ID.
    */
    async findByTIDWithSynonyms(id: number): Promise<Taxon> {
        return this.myRepository.findOne({
            relations: ["acceptedTaxonStatuses", "acceptedTaxonStatuses.parentTaxon"],
            where: {id: id}
        })
    }

    /*
    Find a taxon using a taxon ID.
     */
    async findByTID(id: number): Promise<Taxon> {
        return this.taxonRepo.findOne({ where: {id: id} })
    }

    /*
    Create a new taxon
     */
    async create(data: Partial<Taxon>): Promise<Taxon> {
        const taxon = this.taxonRepo.create(data);
        return this.taxonRepo.save(taxon);
    }

    /*
    Update a taxon record using a taxon id.
     */
    async updateByID(id: number, data: Partial<Taxon>): Promise<Taxon> {
        const updateResult = await this.taxonRepo.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id)
        }
        return null
    }

    /**
     * @param kingdomName The kingdom that the taxon belongs to
     * @param rankName The name of the taxon's rank
     * @param scientificName The scientificName for the taxon
     * @return number The taxonID if it exists, otherwise -1
     */
    async taxonExists(kingdomName: string, rankName: string, scientificName: string): Promise<number> {
        const taxon = await this.taxonRepo.findOne({
            select: ['id'],
            where: {
                scientificName,
                rank: {
                    kingdomName,
                    rankName
                }
            },
            relations: ['rank']
        });
        return taxon === null ? -1 : taxon.id;
    }
}
