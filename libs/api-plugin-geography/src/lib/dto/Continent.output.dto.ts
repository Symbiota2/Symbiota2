import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GeoThesaurusContinent } from '@symbiota2/api-database';
import {
    ApiContinentListItemOutput,
    ApiContinentOutput
} from '@symbiota2/data-access';

@Exclude()
export class ContinentListItem implements ApiContinentListItemOutput {
    constructor(continent: Partial<GeoThesaurusContinent>) {
        Object.assign(this, continent);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    acceptedID: number;

    @ApiProperty()
    @Expose()
    continentTerm;
}

@Exclude()
export class Continent extends ContinentListItem implements ApiContinentOutput {
    @ApiProperty()
    @Expose()
    footprintWKT: string;
}
