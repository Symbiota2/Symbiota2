import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiQueryFindUsers } from '@symbiota2/data-access';

export class FindAllQuery implements ApiQueryFindUsers {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    username?: string;

    @ApiProperty({ required: false, type: String, isArray: true })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    'username[]'?: string[];

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    email?: string;

    @ApiProperty({ required: false, type: String, isArray: true })
    'email[]'?: string[];

    @ApiProperty({ type: 'number', required: false, default: 10 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(25)
    @IsOptional()
    limit = 10;

    @ApiProperty({ type: 'number', required: false, default: 0 })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @IsOptional()
    offset = 0;
}
