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

    /**
     * Find all of the taxonomic authority records potentially using an
     * optional list of taxonomic authority ids
     * Can also limit the number fetched and use an offset.
     * Set find params using the 'TaxonomicAuthorityFindAllParamss'
     * @param params - the 'TaxonomicAuthorityFindAllParams'
     * @returns Observable of response from api casted as `TaxonomicAuthority[]`
     * will be the found authorities
     * @returns `of(null)` if api errors or not found
     * @see TaxonomicAuthority
     * @see TaxonomicAuthorityFindAllParams
     */
    async findAll(params?: TaxonomicAuthorityFindAllParams): Promise<TaxonomicAuthority[]> {
        const { limit, offset, ...qParams } = params;

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            : this.myRepository.find({take: limit, skip: offset})
    }

    /**
     * Create a taxonomic authority record using a Partial TaxonomicAuthority record
     * @param data The Partial data for the record to create
     * @return number The created data or null (not found)
     */
    async create(data: Partial<TaxonomicAuthority>): Promise<TaxonomicAuthority> {
        const taxon = this.myRepository.create(data);
        return this.myRepository.save(taxon);
    }

    /**
     * Update a taxononomic authority record using an authority id.
     * @param id The id of the taxonomic authority
     * @param data The data to update
     * @return TaxonomicAuthority The updated data or null (not found or api error)
     */
    async updateByID(id: number, data: Partial<TaxonomicAuthority>): Promise<TaxonomicAuthority> {
        const updateResult = await this.myRepository.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id);
        }
        return null;
    }

}
