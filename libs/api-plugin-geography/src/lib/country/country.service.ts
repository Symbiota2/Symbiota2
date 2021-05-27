import { Inject, Injectable } from '@nestjs/common';
import { GeoThesaurusCountry } from '@symbiota2/api-database';
import { Repository } from 'typeorm';

type FindAllReturn = Pick<GeoThesaurusCountry, 'id' | 'continentID' | 'acceptedID' | 'countryTerm'>;

@Injectable()
export class CountryService {
    constructor(
        @Inject(GeoThesaurusCountry.PROVIDER_ID)
        private readonly countryRepo: Repository<GeoThesaurusCountry>) { }

    async findAll(): Promise<FindAllReturn[]> {
        return this.countryRepo.find({
            select: ['id', 'continentID', 'acceptedID', 'countryTerm']
        });
    }

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
