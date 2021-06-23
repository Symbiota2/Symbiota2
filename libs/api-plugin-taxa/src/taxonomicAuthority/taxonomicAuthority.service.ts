import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { TaxonomicAuthorityFindAllParams } from './dto/taxonomicAuthority-find-all.input.dto';
import { BaseService } from '@symbiota2/api-common';
import { TaxonomicAuthority } from '@symbiota2/api-database';

@Injectable()
export class TaxonomicAuthorityService extends BaseService<TaxonomicAuthority>{
    constructor(
        @Inject(TaxonomicAuthority.PROVIDER_ID)
        private readonly myRepository: Repository<TaxonomicAuthority>) {

        super(myRepository);
    }

    /*
    Fetch all of the taxonomic authorities.
    Can limit the list by a list of authority IDs.
    Can also limit the number fetched and use an offset.
     */
    async findAll(params?: TaxonomicAuthorityFindAllParams): Promise<TaxonomicAuthority[]> {
        const { limit, offset, ...qParams } = params;

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            : this.myRepository.find({take: limit, skip: offset})
    }

    /*
    TODO: Not sure if this is implemented correctly.
     */
    async create(data: Partial<TaxonomicAuthority>): Promise<TaxonomicAuthority> {
        const taxon = this.myRepository.create(data);
        return this.myRepository.save(taxon);
    }

    /*
    TODO: Implement
     */
    async updateByID(id: number, data: Partial<TaxonomicAuthority>): Promise<TaxonomicAuthority> {
        const updateResult = await this.myRepository.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id);
        }
        return null;
    }

}
