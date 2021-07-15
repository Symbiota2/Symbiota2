import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class InstitutionBodyDto {
    @ApiProperty()
    @IsString()
    @IsOptional({ groups: ['update'] })
    code: string;

    @ApiProperty()
    @IsString()
    @IsOptional({ groups: ['update'] })
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional({ groups: ['update'] })
    address1: string;

    @ApiProperty()
    @IsString()
    @IsOptional({ groups: ['update'] })
    address2: string;

    @ApiProperty()
    @IsString()
    @IsOptional({ groups: ['update'] })
    city: string;

    @ApiProperty()
    @IsString()
    @IsOptional({ groups: ['update'] })
    stateProvince: string;

    @ApiProperty()
    @IsString()
    @IsOptional({ groups: ['update'] })
    postalCode: string;

    @ApiProperty()
    @IsString()
    @IsOptional({ groups: ['update'] })
    country: string;

    @ApiProperty()
    @IsString()
    @IsOptional({ groups: ['update'] })
    phone: string;

    @ApiProperty()
    @IsString()
    @IsOptional({ groups: ['update'] })
    contact: string;

    @ApiProperty()
    @IsString()
    @IsOptional({ groups: ['update'] })
    email: string;

    @ApiProperty()
    @IsString()
    @IsOptional({ groups: ['update'] })
    url: string;

    @ApiProperty()
    @IsString()
    @IsOptional({ groups: ['update'] })
    notes: string;
}
