import { Inject, Injectable } from '@nestjs/common';
import {
    GeoThesaurusContinent,
} from '@symbiota2/api-database';
import { Repository } from 'typeorm';

type ContinentListReturnVal = Pick<GeoThesaurusContinent, 'id' | 'acceptedID' | 'continentTerm'>;
type ContinentReturnVal = Pick<GeoThesaurusContinent, 'id' | 'acceptedID' | 'continentTerm' | 'footprintWKT'>;

/**
 * Service for retrieving continents from the database
 */
@Injectable()
export class ContinentService {
    constructor(
        @Inject(GeoThesaurusContinent.PROVIDER_ID)
        private readonly continentRepo: Repository<GeoThesaurusContinent>) { }

    /**
     * Retrieve a continent by ID
     * @param id The ID of the continent to retrieve
     * @return Promise<ContinentReturnVal> The continent with the given ID
     */
    async findOne(id: number): Promise<ContinentReturnVal> {
        return this.continentRepo.findOne(id, {
            select: ['id', 'acceptedID', 'continentTerm', 'footprintWKT']
        });
    }

    /**
     * @return Promise<ContinentListReturnVal[]> The list of continents in
     * the database
     */
    async findAll(): Promise<ContinentListReturnVal[]> {
        return this.continentRepo.find({
            select: ['id', 'acceptedID', 'continentTerm']
        });
    }
}
