import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseFindAllParams } from '@symbiota2/api-common';

export class I18nInputParams extends BaseFindAllParams {
    @ApiProperty({ name: 'language', type: String, required: true })
    @Type(() => String )
    @IsOptional()
    language: string;

    @ApiProperty({ name: 'key', type: String, required: true })
    @Type(() => String )
    @IsOptional()
    key: string;

    @ApiProperty({ name: 'value', type: String, required: true })
    @Type(() => String )
    @IsOptional()
    value: string;

    @ApiProperty({ name: 'translatable', type: Boolean, required: true })
    @Type(() => Boolean )
    @IsOptional()
    translatable: boolean;
}
