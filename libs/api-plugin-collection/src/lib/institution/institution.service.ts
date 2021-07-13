import { Inject, Injectable } from '@nestjs/common';
import { Institution } from '@symbiota2/api-database';
import { DeepPartial, Repository } from 'typeorm';
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
        private readonly institutionRepo: Repository<Institution>) {
        super(institutionRepo);
    }

    /**
     * Retrieve a list of Institutions from the database
     * @param params The query parameters for the list of institutions
     */
    findAll(params?: InstitutionFindAllParams): Promise<Institution[]> {
        const { limit, offset, ...qParams } = params;
        return this.institutionRepo.find({
            select: ['id', 'name'],
            where: qParams,
            take: limit,
            skip: offset
        });
    }

    /**
     * Creates a new institution
     * @param data The fields for the institution
     */
    create(data: DeepPartial<Institution>): Promise<Institution> {
        const institution = this.institutionRepo.create(data);
        return this.institutionRepo.save(institution);
    }

    /**
     * Updates the institution with the given ID
     * @param id The id of the institution to update
     * @param data The institution fields to update
     */
    async update(id: number, data: DeepPartial<Institution>): Promise<Institution> {
        const institution = await this.institutionRepo.findOne(id, { select: ['id'] });
        if (!institution) {
            return null;
        }
        return this.institutionRepo.save({
            id,
            ...data,
            lastModifiedTimestamp: new Date()
        });
    }
}
