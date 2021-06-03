import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiStateProvinceQueryInput } from '@symbiota2/data-access';

export class ProvinceFindManyQuery implements ApiStateProvinceQueryInput {
    public static readonly DEFAULT_LIMIT = 100;
    public static readonly DEFAULT_OFFSET = 0;

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    countryID?: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    stateTerm?: string;

    @ApiProperty({ required: false, default: ProvinceFindManyQuery.DEFAULT_LIMIT })
    @IsInt()
    @IsOptional()
    limit: number = ProvinceFindManyQuery.DEFAULT_LIMIT;

    @ApiProperty({ required: false, default: ProvinceFindManyQuery.DEFAULT_OFFSET })
    @IsInt()
    @IsOptional()
    offset: number = ProvinceFindManyQuery.DEFAULT_OFFSET;
}
