import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GeoThesaurusCountry } from '@symbiota2/api-database';

export interface ApiCountryListItemOutput {
    id: number;
    continentID: number;
    acceptedID: number;
    countryTerm: string;
}

@Exclude()
export class CountryListItem implements ApiCountryListItemOutput {
    constructor(country: Partial<GeoThesaurusCountry>) {
        Object.assign(this, country);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    continentID: number;

    @ApiProperty()
    @Expose()
    acceptedID: number;

    @ApiProperty()
    @Expose()
    countryTerm: string;
}
