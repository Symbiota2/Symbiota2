import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseFindAllParams } from '@symbiota2/api-common';

export class TaxonomicUnitFindAllParams extends BaseFindAllParams {
    static readonly DEFAULT_LIMIT = 1000;
    static readonly DEFAULT_OFFSET = 0;
    static readonly MAX_LIMIT = 1000;

    @ApiProperty({ name: 'id[]', type: [Number], required: false })
    @Type(() => Number)
    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    id: number[];

    @Min(0)
    @Max(TaxonomicUnitFindAllParams.MAX_LIMIT)
    limit: number = TaxonomicUnitFindAllParams.DEFAULT_LIMIT;

    @ApiProperty({ required: false, default: TaxonomicUnitFindAllParams.DEFAULT_OFFSET })
    @Min(0)
    offset: number = TaxonomicUnitFindAllParams.DEFAULT_OFFSET;
}
