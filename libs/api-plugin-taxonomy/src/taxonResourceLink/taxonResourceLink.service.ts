import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { TaxonResourceLinkFindAllParams } from './dto/taxonResourceLink-find-all.input.dto';
import { BaseService } from '@symbiota2/api-common';
import { TaxonResourceLink } from '@symbiota2/api-database';

@Injectable()
export class TaxonResourceLinkService extends BaseService<TaxonResourceLink>{
    constructor(
        @Inject(TaxonResourceLink.PROVIDER_ID)
        private readonly myRepository: Repository<TaxonResourceLink>) {

        super(myRepository);
    }

    /*
    Fetch all of the taxo resource links.
    Can limit the list by a list of ids.
    Can also limit the number fetched and use an offset.
     */
    async findAll(params?: TaxonResourceLinkFindAllParams): Promise<TaxonResourceLink[]> {
        const { limit, offset, ...qParams } = params;

        return await (qParams.id)?
            this.myRepository.find({take: limit, skip: offset, where: { id: In(params.id)}})
            : this.myRepository.find({take: limit, skip: offset})
    }

    /*
    TODO: Not sure if this is implemented correctly.
     */
    async create(data: Partial<TaxonResourceLink>): Promise<TaxonResourceLink> {
        const taxon = this.myRepository.create(data);
        return this.myRepository.save(taxon);
    }

    /*
    TODO: Implement
     */
    async updateByID(id: number, data: Partial<TaxonResourceLink>): Promise<TaxonResourceLink> {
        const updateResult = await this.myRepository.update({ id }, data);
        if (updateResult.affected > 0) {
            return this.findByID(id);
        }
        return null;
    }

}
