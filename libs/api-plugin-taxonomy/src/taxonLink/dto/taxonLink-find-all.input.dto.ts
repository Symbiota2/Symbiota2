import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsInt, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { BaseFindAllParams } from '@symbiota2/api-common'

export class TaxonLinkFindAllParams extends BaseFindAllParams {
    static readonly DEFAULT_LIMIT = 500
    static readonly DEFAULT_OFFSET = 0
    static readonly MAX_LIMIT = 1000

    @ApiProperty({ name: 'id[]', type: [Number], required: false })
    @Type(() => Number)
    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    id: number[]

    @ApiProperty({ name: 'taxonID[]', type: [Number], required: false })
    @Type(() => Number)
    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    taxonID: number[]

    @Min(0)
    @Max(TaxonLinkFindAllParams.MAX_LIMIT)
    limit: number = TaxonLinkFindAllParams.DEFAULT_LIMIT

    @ApiProperty({ required: false, default: TaxonLinkFindAllParams.DEFAULT_OFFSET })
    @Min(0)
    offset: number = TaxonLinkFindAllParams.DEFAULT_OFFSET
}
