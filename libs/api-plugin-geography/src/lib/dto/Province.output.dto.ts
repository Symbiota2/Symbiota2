import {
    ApiStateProvinceListItemOutput,
    ApiStateProvinceOutput
} from '@symbiota2/data-access';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ProvinceListItem implements ApiStateProvinceListItemOutput {
    constructor(province: ApiStateProvinceListItemOutput) {
        Object.assign(this, province);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    countryID: number;

    @ApiProperty()
    @Expose()
    stateTerm: string;
}

@Exclude()
export class Province implements ApiStateProvinceOutput {
    constructor(province: ApiStateProvinceOutput) {
        Object.assign(this, province);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    stateTerm: string;

    @ApiProperty()
    @Expose()
    acceptedID: number;

    @ApiProperty()
    @Expose()
    countryID: number;

    @ApiProperty()
    @Expose()
    footprintWKT: string;
}
