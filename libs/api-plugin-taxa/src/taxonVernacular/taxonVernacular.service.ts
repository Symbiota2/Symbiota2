import { Inject, Injectable } from '@nestjs/common';
import { Taxon, TaxonVernacular } from '@symbiota2/api-database';
import { In, Repository } from 'typeorm';
import { TaxonVernacularFindAllParams } from './dto/taxonVernacular-find-all.input.dto';
import { BaseService } from '@symbiota2/api-common';
import { TaxonVernacularFindParams } from './dto/taxonVernacular-find.input.dto';


@Injectable()
export class TaxonVernacularService extends BaseService<TaxonVernacular>{
    constructor(
        @Inject(TaxonVernacular.PROVIDER_ID)
        private readonly myRepository: Repository<TaxonVernacular>) {

        super(myRepository);
    }

    /*
    Find all of the taxonVernacular rows possibly using an array of ids
     */
    async findAll(params?: TaxonVernacularFindAllParams): Promise<TaxonVernacular[]> {
        const { limit, offset, ...qParams } = params
        if (qParams.taxonAuthorityID) {
            // Have to use the query builder since where filter on nested relations does not work
            const qb = this.myRepository.createQueryBuilder('o')
                .innerJoin('o.taxon', 't')
                .innerJoin('t.taxonStatuses', 's')
                .where('t.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })

            if (qParams.id) {
                qb.andWhere('o.taxonID IN :taxonID', {taxonID: params.id})
            }

            return qb.getMany()
        } else {
            return await (qParams.id)?
                this.myRepository.find({
                    take: limit,
                    skip: offset,
                    where: { id: In(params.id)}})
                : this.myRepository.find({take: limit, skip: offset})
        }

    }

    /*
     Get a list of all of the languages
     */
    async findAllLanguages(): Promise<TaxonVernacular[]> {
        const results = await this.myRepository.createQueryBuilder('o')
            .select([
                'o.language'
            ])
            .groupBy('o.language')  // using group by because distinct did not work!
            //.where(whereClause)
            .getMany()

        return Promise.all(
            results.map(async (language : TaxonVernacular) => {
                return language
            })
        )
    }

    /*
     Get a list of all of the common names
     */
    async findAllCommonNames(params?: TaxonVernacularFindParams): Promise<TaxonVernacular[]> {
        const { ...qParams } = params
        // Check if there is a taxonAuthorityID specified
        if (qParams.taxonAuthorityID) {
            const whereClause = (qParams.id)? "o.taxonID in " + params.id : "true"
            const names = await this.myRepository.createQueryBuilder('o')
                .select([
                    'o.vernacularName'
                ])
                .innerJoin('o.taxon', 't')
                .innerJoin('t.taxonStatuses', 's')
                .where('s.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })
                .andWhere("o.vernacularName IS NOT NULL AND " + whereClause)
                .groupBy('o.vernacularName')  // For distinct
                .orderBy("o.vernacularName")
                .getMany()

            return names

        } else {
            const whereClause = (qParams.id)? "o.taxonID in " + params.id : "true"
            const names = await this.myRepository.createQueryBuilder('o')
                .select([
                    'o.vernacularName'
                ])
                .where("o.vernacularName IS NOT NULL AND " + whereClause)
                .groupBy('o.vernacularName')  // For distinct
                .orderBy("o.vernacularName")
                .getMany()

            return names
        }
    }

    // Get a list of all of the common names for a given language
    async findAllCommonNamesByLanguage(language: string, params?: TaxonVernacularFindParams): Promise<TaxonVernacular[]> {
        const { ...qParams } = params
        const whereClause = (qParams.id)? "o.taxonID in " + params.id : "true"
        if (qParams.taxonAuthorityID) {
            const names = await this.myRepository.createQueryBuilder('o')
                .select([
                    'o.vernacularName'
                ])
                .innerJoin('o.taxon', 't')
                .innerJoin('t.taxonStatuses', 's')
                .where('s.taxonAuthorityID = :authorityID', { authorityID: params.taxonAuthorityID })
                .andWhere("o.language = '" + language + "' AND o.vernacularName IS NOT NULL AND " + whereClause)
                .groupBy('o.vernacularName')  // For distinct
                .orderBy("o.vernacularName")
                .getMany()

            return names

        } else {
            const names = await this.myRepository.createQueryBuilder('o')
                .select([
                    'o.vernacularName'
                ])
                .where("o.language = '" + language + "' AND o.vernacularName IS NOT NULL AND " + whereClause)
                .groupBy('o.vernacularName')  // For distinct
                .orderBy("o.vernacularName")
                .getMany()

            return names
        }
    }

    async findByCommonName(commonName: string, params?: TaxonVernacularFindParams): Promise<TaxonVernacular[]> {
        const { ...qParams } = params
        if (qParams.taxonAuthorityID) {
            // Have to use the query builder since where filter on nested relations does not work

            const qb = this.myRepository.createQueryBuilder('o')
                //.select('o.*')
                .leftJoin('o.taxon', 't')
                .leftJoin('t.taxonStatuses', 's')
                .where('s.taxonAuthorityID = :authorityID AND o.vernacularName = :name', { authorityID: params.taxonAuthorityID,
                name: commonName})
                //.andWhere('o.vernacularName = :commonName', { commonName: commonName} )

            return qb.getMany()
        } else {
            return await this.myRepository.find({where: {vernacularName: commonName}})
        }
    }

    async findByTID(id: number): Promise<TaxonVernacular> {
        return await this.myRepository.findOne({where: {id: id}})
    }

    async create(data: Partial<TaxonVernacular>): Promise<TaxonVernacular> {
        const taxon = this.myRepository.create(data);
        return this.myRepository.save(taxon);
    }

    async updateByID(id: number, data: Partial<TaxonVernacular>): Promise<TaxonVernacular> {
        const updateResult = await this.myRepository.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id);
        }
        return null;
    }

}
