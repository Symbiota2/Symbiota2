import { Exclude, Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

@Exclude()
export class I18nInputDto {

    // Two letter language name
    @ApiProperty()
    @Expose()
    language: string;

    // Key of field
    @ApiProperty()
    @Expose()
    key: string;

    // Value of field
    @ApiProperty()
    @Expose()
    value: string | null;

    // Value of field
    @ApiProperty()
    @Expose()
    translatable: boolean;
}
