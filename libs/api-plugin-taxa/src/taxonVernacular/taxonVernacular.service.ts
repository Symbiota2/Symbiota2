import { Inject, Injectable } from '@nestjs/common';
import { TaxonVernacular } from '@symbiota2/api-database';
import { In, Repository } from 'typeorm';
import { TaxonVernacularFindAllParams } from './dto/taxonVernacular-find-all.input.dto';
import { BaseService } from '@symbiota2/api-common';


@Injectable()
export class TaxonVernacularService extends BaseService<TaxonVernacular>{
    constructor(
        @Inject(TaxonVernacular.PROVIDER_ID)
        private readonly myRepository: Repository<TaxonVernacular>) {

        super(myRepository);
    }

    // Find all of the taxonVernacular rows possibly using an array of ids
    async findAll(params?: TaxonVernacularFindAllParams): Promise<TaxonVernacular[]> {
        const { limit, offset, ...qParams } = params
        return await (qParams.id)?
              this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            : this.myRepository.find({take: limit, skip: offset})
    }

    // Get a list of all of the languages
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

    // Get a list of all of the common names
    async findAllCommonNames(params?: TaxonVernacularFindAllParams): Promise<TaxonVernacular[]> {
        const { limit, offset, ...qParams } = params
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

    // Get a list of all of the common names for a given language
    async findAllCommonNamesByLanguage(language: string, params?: TaxonVernacularFindAllParams): Promise<TaxonVernacular[]> {
        const { limit, offset, ...qParams } = params
        const whereClause = (qParams.id)? "o.taxonID in " + params.id : "true"
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

    async findByCommonName(commonName: string): Promise<TaxonVernacular[]> {
        // const { limit, offset, ...qParams } = params;
        return await this.myRepository.find({where: {vernacularName: commonName}});
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
