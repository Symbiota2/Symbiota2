import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseFindAllParams } from '@symbiota2/api-common';

export class TaxonomicEnumTreeFindAllParams extends BaseFindAllParams {
    static readonly DEFAULT_LIMIT = 5
    static readonly DEFAULT_OFFSET = 0
    static readonly MAX_LIMIT = 15
    static readonly DEFAULT_AUTHORITY = 1

    @ApiProperty({ name: 'taxonAuthorityID', type: Number, required: false, default: TaxonomicEnumTreeFindAllParams.DEFAULT_AUTHORITY })
    @Type(() => Number)
    @IsInt({ each: true })
    @IsOptional()
    taxonAuthorityID: number

    @ApiProperty({ name: 'taxonID[]', type: [Number], required: false })
    @Type(() => Number)
    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    taxonID: number[]


    /*
    @ApiProperty({ name: 'taxonid', type: Number, required: false })
    @Type(() => Number)
    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    taxonid: number
    */

    @Min(0)
    @Max(TaxonomicEnumTreeFindAllParams.MAX_LIMIT)
    limit: number = TaxonomicEnumTreeFindAllParams.DEFAULT_LIMIT;

    @ApiProperty({ required: false, default: TaxonomicEnumTreeFindAllParams.DEFAULT_OFFSET })
    @Min(0)
    offset: number = TaxonomicEnumTreeFindAllParams.DEFAULT_OFFSET;
}
