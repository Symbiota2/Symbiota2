import { Inject, Injectable } from '@nestjs/common';
import { GeoThesaurusCountry } from '@symbiota2/api-database';
import { Like, Repository } from 'typeorm';

type FindAllReturn = Pick<GeoThesaurusCountry, 'id' | 'continentID' | 'acceptedID' | 'countryTerm'>;

/**
 * Service for retrieving countries from the database
 */
@Injectable()
export class CountryService {
    constructor(
        @Inject(GeoThesaurusCountry.PROVIDER_ID)
        private readonly countryRepo: Repository<GeoThesaurusCountry>) { }

    /**
     * Retrieve a list of countries from the database
     */
    async findAll(searchTerm?: string, take = null): Promise<FindAllReturn[]> {
        const where = searchTerm ? { countryTerm: Like(`${searchTerm}%`) } : null;
        return this.countryRepo.find({
            select: ['id', 'continentID', 'acceptedID', 'countryTerm'],
            order: { 'countryTerm': 'ASC' },
            where: where,
            take: take
        });
    }

    /**
     * Retrieve a specific country by ID
     * @param id The ID of the country to return
     */
    async findOne(id: number): Promise<GeoThesaurusCountry> {
        return this.countryRepo.findOne(id, {
            select: [
                'id',
                'continentID',
                'acceptedID',
                'countryTerm',
                'iso',
                'iso3',
                'footprintWKT'
            ]
        });
    }
}
