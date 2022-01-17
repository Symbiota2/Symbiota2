import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsInt, Max, Min, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer'
import { BaseFindAllParams } from '@symbiota2/api-common'

export class ImageContributorsSearchParams extends BaseFindAllParams {
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

    @ApiProperty({ name: 'commonname[]', type: [String], required: false })
    @Type(() => String)
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    commonname: string[]

    @ApiProperty({ name: 'keyword[]', type: [String], required: false })
    @Type(() => String)
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    keyword: string[]

    @ApiProperty({ name: 'startDate', type: Date, required: false })
    @Type(() => String)
    @IsDate()
    @IsOptional()
    startDate: Date

    @ApiProperty({ name: 'endDate', type: Date, required: false })
    @Type(() => String)
    @IsDate()
    @IsOptional()
    endDate: Date

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

    @Min(0)
    @Max(ImageContributorsSearchParams.MAX_LIMIT)
    limit: number = ImageContributorsSearchParams.DEFAULT_LIMIT

    @ApiProperty({ required: false, default: ImageContributorsSearchParams.DEFAULT_OFFSET })
    @Min(0)
    offset: number = ImageContributorsSearchParams.DEFAULT_OFFSET
}
