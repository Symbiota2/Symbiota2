import { ApiProperty } from '@nestjs/swagger';
import { AdminLanguage } from '@symbiota2/api-database';
import { Exclude, Expose, plainToClass } from 'class-transformer';

@Exclude()
export class LanguageOutputDto {
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

    static fromEntity(language: AdminLanguage) {
        return plainToClass(LanguageOutputDto, language);
    }
}
