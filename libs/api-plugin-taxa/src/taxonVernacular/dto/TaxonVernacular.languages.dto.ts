import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TaxonVernacularLanguagesDto {
    constructor(languages: string[]) {
        Object.assign(this, languages);
    }

    @ApiProperty()
    @Expose()S
    languages: string[];

}
