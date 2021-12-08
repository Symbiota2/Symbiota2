import { Inject, Injectable } from '@nestjs/common';
import { In, LessThan, Repository } from 'typeorm';
import { TaxonomicUnitFindAllParams } from './dto/taxonomicUnit-find-all.input.dto';
import { BaseService } from '@symbiota2/api-common';
import { TaxonomicUnit } from '@symbiota2/api-database';

@Injectable()
export class TaxonomicUnitService extends BaseService<TaxonomicUnit>{
    constructor(
        @Inject(TaxonomicUnit.PROVIDER_ID)
        private readonly taxonRanks: Repository<TaxonomicUnit>) {

        super(taxonRanks);
    }

    /*
    Fetch all of the taxonomic units.
    Can limit the list by a list of Unit IDs.
    Can also limit the number fetched and use an offset.
     */
    async findAll(params?: TaxonomicUnitFindAllParams): Promise<TaxonomicUnit[]> {
        const { limit, offset, ...qParams } = params;

        return await (qParams.id)?
            this.taxonRanks.find({
                take: limit,  // Set default limit high since table is small
                skip: offset,
                where: { id: In(params.id) }
            })
            : this.taxonRanks.find({take: limit, skip: offset})
    }

    /*
    TODO: Not sure if this is implemented correctly.
     */
    async create(data: Partial<TaxonomicUnit>): Promise<TaxonomicUnit> {
        const taxon = this.taxonRanks.create(data);
        return this.taxonRanks.save(taxon);
    }

    /*
    TODO: Implement
     */
    async updateByID(id: number, data: Partial<TaxonomicUnit>): Promise<TaxonomicUnit> {
        const updateResult = await this.taxonRanks.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id);
        }
        return null;
    }

    async getAncestorRanks(rank: TaxonomicUnit): Promise<TaxonomicUnit[]> {
        return this.taxonRanks.find({
            kingdomName: rank.kingdomName,
            rankID: LessThan(rank.rankID)
        });
    }

    async getMostSpecificRank(ranks: TaxonomicUnit[]): Promise<TaxonomicUnit> {
        return ranks.reduce((previous, current) => {
            return previous.rankID > current.rankID ? previous : current;
        }, ranks[0]);
    }

    async getDirectParentRank(rank: TaxonomicUnit): Promise<TaxonomicUnit> {
        const allAncestors = await this.getAncestorRanks(rank);
        return await this.getMostSpecificRank(allAncestors);
    }
}
