import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsDateString, IsOptional, IsEmail } from 'class-validator';
import { ApiUserProfileData } from '@symbiota2/data-access';

/**
 * Object representing the body of a POST request that updates a user's profile
 * data
 */
export class UserInputDto implements ApiUserProfileData {
    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    title: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    institution: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    department: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    address: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    city: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    state: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    zip: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    country: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    phone: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    url: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    biography: string;

    @ApiProperty()
    @IsBoolean()
    @Transform(({ value }) => value === 1)
    isPublic: number;
}
