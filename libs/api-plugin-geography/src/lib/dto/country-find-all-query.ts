import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class CountryFindAllQuery {
    @ApiProperty({ required: false })
    @IsNumberString()
    @IsOptional()
    limit: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    countryTerm: string;
}
