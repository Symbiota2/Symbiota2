import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TaxonNamesDto {
    constructor(scientificNames: string[]) {
        Object.assign(this, scientificNames);
    }

    @ApiProperty()
    @Expose()
    scientificNames: string[];

}
