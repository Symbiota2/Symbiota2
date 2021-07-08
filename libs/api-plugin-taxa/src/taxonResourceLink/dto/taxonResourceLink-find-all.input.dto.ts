import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseFindAllParams } from '@symbiota2/api-common';

export class TaxonResourceLinkFindAllParams extends BaseFindAllParams {
    static readonly DEFAULT_LIMIT = 5;
    static readonly DEFAULT_OFFSET = 0;
    static readonly MAX_LIMIT = 15;

    @ApiProperty({ name: 'id[]', type: [Number], required: false })
    @Type(() => Number)
    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    id: number[];

    @Min(0)
    @Max(TaxonResourceLinkFindAllParams.MAX_LIMIT)
    limit: number = TaxonResourceLinkFindAllParams.DEFAULT_LIMIT;

    @ApiProperty({ required: false, default: TaxonResourceLinkFindAllParams.DEFAULT_OFFSET })
    @Min(0)
    offset: number = TaxonResourceLinkFindAllParams.DEFAULT_OFFSET;
}
