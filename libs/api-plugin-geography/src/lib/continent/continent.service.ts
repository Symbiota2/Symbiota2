import { Inject, Injectable } from '@nestjs/common';
import {
    GeoThesaurusContinent,
} from '@symbiota2/api-database';
import { Repository } from 'typeorm';

type ContinentListReturnVal = Pick<GeoThesaurusContinent, 'id' | 'acceptedID' | 'continentTerm'>;
type ContinentReturnVal = Pick<GeoThesaurusContinent, 'id' | 'acceptedID' | 'continentTerm' | 'footprintWKT'>;

@Injectable()
export class ContinentService {
    constructor(
        @Inject(GeoThesaurusContinent.PROVIDER_ID)
        private readonly continentRepo: Repository<GeoThesaurusContinent>) { }

    async findOne(id: number): Promise<ContinentReturnVal> {
        return this.continentRepo.findOne(id, {
            select: ['id', 'acceptedID', 'continentTerm', 'footprintWKT']
        });
    }

    async findAll(): Promise<ContinentListReturnVal[]> {
        return this.continentRepo.find({
            select: ['id', 'acceptedID', 'continentTerm']
        });
    }
}
