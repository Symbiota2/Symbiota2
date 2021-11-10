import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsArray, IsInt, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class TaxonomicEnumTreeMoveTaxonParams  {
    static readonly DEFAULT_AUTHORITY = 1

    @ApiProperty({ name: 'taxonAuthorityID', type: Number, required: true, default: TaxonomicEnumTreeMoveTaxonParams.DEFAULT_AUTHORITY })
    @Type(() => Number)
    @IsInt({ each: true })
    //@IsOptional()
    taxonAuthorityID: number

    @ApiProperty({ name: 'taxonID', type: Number, required: true })
    @Type(() => Number)
    @IsInt({ each: true })
    //@IsOptional()
    taxonID: number

    @ApiProperty({ name: 'parentTaxonID', type: Number, required: true })
    @Type(() => Number)
    @IsInt({ each: true })
    //@IsOptional()
    parentTaxonID: number
}
