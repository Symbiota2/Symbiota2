import { Exclude, Expose, Type } from 'class-transformer';
import { TaxonVernacular } from '@symbiota2/api-database';
import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
export class TaxonVernacularOutputDto {

    constructor(taxa: TaxonVernacular) {
        Object.assign(this, taxa);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    taxonID: number;

    @ApiProperty()
    @Expose()
    vernacularName: string;

    @ApiProperty()
    @Expose()
    language: string;

    @ApiProperty()
    @Expose()
    adminLanguageID: number | null;

    @ApiProperty()
    @Expose()
    source: string;

    @ApiProperty()
    @Expose()
    notes: string;

    @ApiProperty()
    @Expose()
    username: string;

    @ApiProperty()
    @Expose()
    isUpperTerm: number | null;

    @ApiProperty()
    @Expose()
    sortSequence: number | null;

    @ApiProperty()
    @Expose()
    initialTimestamp: Date;

}
