import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
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


    @Min(0)
    @Max(1)
    @ApiProperty({ name: 'translatable', type: Number, required: true })
    @Type(() => Number )
    @IsInt({ each: true })
    @IsOptional()
    translatable: number
}
