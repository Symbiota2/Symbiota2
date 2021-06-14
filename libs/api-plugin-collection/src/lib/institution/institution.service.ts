import { Inject, Injectable } from '@nestjs/common';
import { Institution } from '@symbiota2/api-database';
import { Repository } from 'typeorm';
import { BaseService } from '@symbiota2/api-common';

type InstitutionFindAllParams = {
    limit?: number;
    offset?: number;
    city?: string;
    stateProvince?: string;
    country?: string;
};

/**
 * Service for retrieving institutional owners of specimen collections
 */
@Injectable()
export class InstitutionService extends BaseService<Institution> {
    constructor(
        @Inject(Institution.PROVIDER_ID)
        private readonly institutions: Repository<Institution>) {

        super(institutions);
    }

    /**
     * Retrieve a list of Institutions from the database
     * @param params The query parameters for the list of institutions
     */
    findAll(params?: InstitutionFindAllParams): Promise<Institution[]> {
        const { limit, offset, ...qParams } = params;
        return this.institutions.find({
            where: qParams,
            take: limit,
            skip: offset
        });
    }
}
