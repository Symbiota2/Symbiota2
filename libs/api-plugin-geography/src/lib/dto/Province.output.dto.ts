import {
    ApiStateProvinceCountryOutput,
    ApiStateProvinceListItemOutput,
    ApiStateProvinceOutput
} from '@symbiota2/data-access';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ProvinceCountry implements ApiStateProvinceCountryOutput {
    constructor(country: ApiStateProvinceCountryOutput) {
        Object.assign(this, country);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    countryTerm: string;
}

@Exclude()
export class ProvinceListItem implements ApiStateProvinceListItemOutput {
    constructor(province: ApiStateProvinceListItemOutput) {
        const { country, ...props } = province;
        Object.assign(this, props);
        this.country = new ProvinceCountry(country);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    @Type(() => ProvinceCountry)
    country: ProvinceCountry;

    @ApiProperty()
    @Expose()
    stateTerm: string;
}

@Exclude()
export class Province extends ProvinceListItem implements ApiStateProvinceOutput {
    constructor(province: ApiStateProvinceOutput) {
        super(province);
    }

    @ApiProperty()
    @Expose()
    acceptedID: number;

    @ApiProperty()
    @Expose()
    footprintWKT: string;
}
