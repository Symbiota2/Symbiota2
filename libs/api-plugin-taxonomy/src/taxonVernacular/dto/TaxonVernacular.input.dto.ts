import { Exclude, Expose, Type } from 'class-transformer';
import { TaxonVernacular } from '@symbiota2/api-database';
import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiCollectionInput } from '@symbiota2/data-access';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class TaxonVernacularInputDto {

    @ApiProperty()
    @IsInt()
    taxonID: number

    @ApiProperty()
    @IsString()
    @IsOptional()
    vernacularName: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    language: string

    @ApiProperty()
    @IsInt()
    @IsOptional()
    adminLanguageID: number | null

    @ApiProperty()
    @IsString()
    @IsOptional()
    source: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    notes: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    username: string

    @ApiProperty()
    @IsInt()
    @IsOptional()
    isUpperTerm: number | null

    @ApiProperty()
    @IsInt()
    @IsOptional()
    sortSequence: number | null

}
