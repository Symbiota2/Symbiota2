import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GeoThesaurusCountry } from '@symbiota2/api-database';
import {
    ApiCountryListItemOutput,
    ApiCountryOutput
} from '@symbiota2/data-access';

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
