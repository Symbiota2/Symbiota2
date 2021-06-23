import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TaxonVernacularNamesDto {
    constructor(commonNames: string[]) {
        Object.assign(this, commonNames);
    }

    @ApiProperty()
    @Expose()
    commonNames: string[];

}
