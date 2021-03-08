import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, MaxLength, IsNumber, IsEnum, IsNumberString } from 'class-validator';

export class CollectionInputDto {
    
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    collectionCode: string;

    @ApiProperty()
    @IsString()
    collectionName: string;

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    institutionID: number;

    @ApiProperty({ required: false })
    @IsString()
    @MaxLength(2000)
    @IsOptional()
    fullDescription: string;

    @ApiProperty({ required: false })
    @IsString()
    @MaxLength(250)
    @IsOptional()
    homePage: string;

    @ApiProperty({ required: false })
    @IsString()
    @MaxLength(500)
    @IsOptional()
    individualUrl: string;

    @ApiProperty({ required: false })
    @IsString()
    @MaxLength(250)
    @IsOptional()
    contact: string;

    @ApiProperty({ required: false })
    @IsString()
    @MaxLength(45)
    @IsOptional()
    email: string;

    @ApiProperty({ required: false })
    @IsNumberString()
    @IsOptional()
    latitude: number;

    @ApiProperty({ required: false })
    @IsNumberString()
    @IsOptional()
    longitude: number;

    @ApiProperty({ required: false })
    @IsString()
    @MaxLength(250)
    @IsOptional()
    icon: string;

    @ApiProperty({ required: false })
    @IsEnum(['Preserved Specimens', 'General Observations', 'Observations'])
    @IsOptional()
    type: string;

    @ApiProperty({ required: false })
    @IsEnum(['Snapshot', 'Live Data'])
    @IsOptional()
    managementType: string;

    @ApiProperty({ required: false })
    @IsString()
    @MaxLength(45)
    @IsOptional()
    rightsHolder: string;

    @ApiProperty({ required: false })
    @IsString()
    @MaxLength(250)
    @IsOptional()
    rights: string;

    @ApiProperty({ required: false })
    @IsString()
    @MaxLength(250)
    @IsOptional()
    usageTerm: string;

    @ApiProperty({ required: false })
    @IsString()
    @MaxLength(1000)
    @IsOptional()
    accessRights: string;
}

export class UpdateCollectionInputDto extends PartialType(CollectionInputDto) {}
