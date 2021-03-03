import { Inject, Injectable } from '@nestjs/common';
import { Institution } from '@symbiota2/api-database';
import { Repository } from 'typeorm';
import { BaseService } from '@symbiota2/api-common';

type InstitutionFindAllParams = {
    city?: string;
    stateProvince?: string;
    country?: string;
};

@Injectable()
export class InstitutionService extends BaseService<Institution> {
    constructor(
        @Inject(Institution.PROVIDER_ID)
        private readonly institutions: Repository<Institution>) {

        super(institutions);
    }

    findAll(params?: InstitutionFindAllParams): Promise<Institution[]> {
        return this.institutions.find(params);
    }
}
