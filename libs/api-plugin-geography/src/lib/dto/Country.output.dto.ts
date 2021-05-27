import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GeoThesaurusCountry } from '@symbiota2/api-database';

export interface ApiCountryListItemOutput {
    id: number;
    continentID: number;
    acceptedID: number;
    countryTerm: string;
}

export interface ApiCountryOutput extends ApiCountryListItemOutput {
    iso: string;
    iso3: string;
    footprintWKT: string;
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

@Exclude()
export class Country extends CountryListItem implements ApiCountryOutput {
    @ApiProperty()
    @Expose()
    iso: string;

    @ApiProperty()
    @Expose()
    iso3: string;

    @ApiProperty()
    @Expose()
    footprintWKT: string;
}
