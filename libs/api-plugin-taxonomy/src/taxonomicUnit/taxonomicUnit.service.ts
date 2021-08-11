import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { TaxonomicUnitFindAllParams } from './dto/taxonomicUnit-find-all.input.dto';
import { BaseService } from '@symbiota2/api-common';
import { TaxonomicUnit } from '@symbiota2/api-database';

@Injectable()
export class TaxonomicUnitService extends BaseService<TaxonomicUnit>{
    constructor(
        @Inject(TaxonomicUnit.PROVIDER_ID)
        private readonly myRepository: Repository<TaxonomicUnit>) {

        super(myRepository);
    }

    /*
    Fetch all of the taxonomic units.
    Can limit the list by a list of Unit IDs.
    Can also limit the number fetched and use an offset.
     */
    async findAll(params?: TaxonomicUnitFindAllParams): Promise<TaxonomicUnit[]> {
        const { limit, offset, ...qParams } = params;

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            : this.myRepository.find({take: limit, skip: offset})
    }

    /*
    TODO: Not sure if this is implemented correctly.
     */
    async create(data: Partial<TaxonomicUnit>): Promise<TaxonomicUnit> {
        const taxon = this.myRepository.create(data);
        return this.myRepository.save(taxon);
    }

    /*
    TODO: Implement
     */
    async updateByID(id: number, data: Partial<TaxonomicUnit>): Promise<TaxonomicUnit> {
        const updateResult = await this.myRepository.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id);
        }
        return null;
    }

}
