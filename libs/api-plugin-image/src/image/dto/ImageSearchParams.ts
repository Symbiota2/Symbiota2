import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsInt, Max, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer'
import { BaseFindAllParams } from '@symbiota2/api-common'

export class ImageSearchParams extends BaseFindAllParams {
    static readonly DEFAULT_LIMIT = 1000
    static readonly DEFAULT_OFFSET = 0
    static readonly MAX_LIMIT = 1000

    @ApiProperty({ name: 'taxaid[]', type: [Number], required: false })
    @Type(() => Number)
    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    taxaid: number[]

    @ApiProperty({ name: 'sciname[]', type: [String], required: false })
    @Type(() => String)
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    sciname: string[]

    @ApiProperty({ name: 'photographer[]', type: [String], required: false })
    @Type(() => String)
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    photographer: string[]

    @ApiProperty({ name: 'key[]', type: [String], required: false })
    @Type(() => String)
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    key: string[]

    @ApiProperty({ name: 'type[]', type: [String], required: false })
    @Type(() => String)
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    type: string[]

    @ApiProperty({ name: 'country[]', type: [String], required: false })
    @Type(() => String)
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    country: string[]

    @ApiProperty({ name: 'province[]', type: [String], required: false })
    @Type(() => String)
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    province: string[]

    @Min(0)
    @Max(ImageSearchParams.MAX_LIMIT)
    limit: number = ImageSearchParams.DEFAULT_LIMIT

    @ApiProperty({ required: false, default: ImageSearchParams.DEFAULT_OFFSET })
    @Min(0)
    offset: number = ImageSearchParams.DEFAULT_OFFSET
}
