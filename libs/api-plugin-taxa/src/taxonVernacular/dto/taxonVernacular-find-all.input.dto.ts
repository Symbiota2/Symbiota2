import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsArray, IsInt, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { BaseFindAllParams } from '@symbiota2/api-common'

export class TaxonVernacularFindAllParams extends BaseFindAllParams {
    static readonly DEFAULT_LIMIT = 5
    static readonly DEFAULT_OFFSET = 0
    static readonly MAX_LIMIT = 15

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

    @Min(0)
    @Max(TaxonVernacularFindAllParams.MAX_LIMIT)
    limit: number = TaxonVernacularFindAllParams.DEFAULT_LIMIT

    @ApiProperty({ required: false, default: TaxonVernacularFindAllParams.DEFAULT_OFFSET })
    @Min(0)
    offset: number = TaxonVernacularFindAllParams.DEFAULT_OFFSET
}
