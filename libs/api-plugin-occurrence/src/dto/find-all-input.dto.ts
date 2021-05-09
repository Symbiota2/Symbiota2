import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean, IsDate, IsDateString,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
    ApiOccurrenceFindAllParams,
    ApiTaxonSearchCriterion
} from '@symbiota2/data-access';

export class FindAllParams implements Partial<ApiOccurrenceFindAllParams> {
    static readonly DEFAULT_LIMIT = 25;
    static readonly DEFAULT_OFFSET = 0;
    static readonly MAX_LIMIT = 128;

    @ApiProperty({ required: false })
    @Type(() => Number)
    @Transform(({ value }) => {
        if (Array.isArray(value)) {
            return value.map((v) => parseInt(v))
        }
        else {
            return parseInt(value);
        }
    })
    @IsOptional()
    collectionID?: number | number[];

    @ApiProperty({ required: false, default: FindAllParams.DEFAULT_LIMIT })
    @IsInt()
    @Min(1)
    @Max(FindAllParams.MAX_LIMIT)
    @IsOptional()
    limit?: number = FindAllParams.DEFAULT_LIMIT;

    @ApiProperty({ required: false, default: FindAllParams.DEFAULT_OFFSET })
    @IsInt()
    @IsOptional()
    offset?: number = FindAllParams.DEFAULT_OFFSET;

    // Taxon criteria

    @ApiProperty({ required: false, enum: ApiTaxonSearchCriterion })
    @IsString()
    @IsEnum(ApiTaxonSearchCriterion)
    @IsOptional()
    taxonSearchCriterion?: ApiTaxonSearchCriterion;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    taxonSearchStr?: string;

    // Locality criteria

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    country?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    county?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    locality?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    stateProvince?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    maximumElevationInMeters?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    minimumElevationInMeters?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    minLatitude?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    minLongitude?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    maxLatitude?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    maxLongitude?: number;

    // Collector criteria
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    collectorLastName: string;

    @ApiProperty({ required: false })
    @IsDate()
    @IsOptional()
    minEventDate: Date;

    @ApiProperty({ required: false })
    @IsDate()
    @IsOptional()
    maxEventDate: Date;

    // Specimen criteria
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    catalogNumber: string;

    // Filters
    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    limitToSpecimens = false;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    limitToImages = false;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    limitToGenetic = false;
}
