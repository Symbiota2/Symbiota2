import { ApiProperty } from '@nestjs/swagger';
import { AdminLanguage } from '@symbiota2/api-database';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LanguageOutputDto {
    constructor(language: AdminLanguage) {
        Object.assign(this, language);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    languageName: string;

    @ApiProperty()
    @Expose()
    iso6391: string;

    @ApiProperty()
    @Expose()
    iso6392: string;

    @ApiProperty()
    @Expose()
    notes: string;
}
