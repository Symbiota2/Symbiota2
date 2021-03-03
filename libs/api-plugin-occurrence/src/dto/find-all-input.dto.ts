import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FindAllParams {
    static readonly DEFAULT_LIMIT = 25;
    static readonly DEFAULT_OFFSET = 0;
    static readonly MAX_LIMIT = 128;

    @ApiProperty({ required: false })
    @IsOptional()
    collectionID?: number;

    @ApiProperty({ type: [Number], required: false })
    @Type(() => Number)
    @Transform(({ value }) => value.map(parseInt))
    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    'collectionID[]'?: number[];

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    catalogNumber?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    scientificName?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    latitudeGt?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    latitudeLt?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    longitudeGt?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    longitudeLt?: number;

    @ApiProperty({ required: false, default: FindAllParams.DEFAULT_LIMIT })
    @IsInt()
    @Min(1)
    @Max(FindAllParams.MAX_LIMIT)
    @IsOptional()
    limit: number = FindAllParams.DEFAULT_LIMIT;

    @ApiProperty({ required: false, default: FindAllParams.DEFAULT_OFFSET })
    @IsInt()
    @IsOptional()
    offset: number = FindAllParams.DEFAULT_OFFSET;
}
