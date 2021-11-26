import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsArray, IsInt, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { BaseFindAllParams } from '@symbiota2/api-common'

export class TaxonFindCommonParams extends BaseFindAllParams {
    static readonly DEFAULT_LIMIT = 5
    static readonly DEFAULT_OFFSET = 0
    static readonly MAX_LIMIT = 15

    @Min(0)
    @Max(TaxonFindCommonParams.MAX_LIMIT)
    limit: number = TaxonFindCommonParams.DEFAULT_LIMIT

    @ApiProperty({ required: false, default: TaxonFindCommonParams.DEFAULT_OFFSET })
    @Min(0)
    offset: number = TaxonFindCommonParams.DEFAULT_OFFSET
}
export class TaxonFindNamesParams extends TaxonFindCommonParams {

    @ApiProperty({ name: 'id[]', type: [Number], required: false })
    @Type(() => Number)
    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    id: number[]

    @ApiProperty({ name: 'taxonAuthorityID', type: Number, required: false })
    @Type(() => Number)
    @IsInt({ each: true })
    @IsOptional()
    taxonAuthorityID: number

    @ApiProperty({ name: 'partialName', type: String, required: false })
    @Type(() => String)
    @IsOptional()
    partialName: string
}

export class TaxonFindAllParams extends TaxonFindCommonParams {

    @ApiProperty({ name: 'id[]', type: [Number], required: false })
    @Type(() => Number)
    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    id: number[]

    @ApiProperty({ name: 'taxonAuthorityID', type: Number, required: false })
    @Type(() => Number)
    @IsInt({ each: true })
    @IsOptional()
    taxonAuthorityID: number

}