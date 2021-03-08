import { BaseFindAllParams } from '@symbiota2/api-common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class InstitutionFindAllParams extends BaseFindAllParams {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    city: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    stateProvince: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    country: string;
}
