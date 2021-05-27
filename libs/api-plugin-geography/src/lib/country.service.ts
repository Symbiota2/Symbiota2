import { Inject, Injectable } from '@nestjs/common';
import { GeoThesaurusCountry } from '@symbiota2/api-database';
import { Repository } from 'typeorm';

@Injectable()
export class CountryService {
    constructor(
        @Inject(GeoThesaurusCountry.PROVIDER_ID)
        private readonly countryRepo: Repository<GeoThesaurusCountry>) { }

    async findAll(): Promise<Partial<GeoThesaurusCountry>[]> {
        return this.countryRepo.find({
            select: ['id', 'continentID', 'acceptedID', 'countryTerm']
        });
    }
}
