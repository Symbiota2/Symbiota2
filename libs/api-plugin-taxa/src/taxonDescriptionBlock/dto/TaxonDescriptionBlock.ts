import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
export class TaxonDescriptionBlock {
    constructor(taxonDescriptionBlock: TaxonDescriptionBlock) {
        Object.assign(this, taxonDescriptionBlock)
    }

    @ApiProperty()
    @Expose()
    id: number

    @ApiProperty()
    @Expose()
    taxonID: number

    @ApiProperty()
    @Expose()
    caption: string

    @ApiProperty()
    @Expose()
    source: string

    @ApiProperty()
    @Expose()
    sourceUrl: string

    @ApiProperty()
    @Expose()
    language: string

    @ApiProperty()
    @Expose()
    adminLanguageID: number | null

    @ApiProperty()
    @Expose()
    displayLevel: number

    @ApiProperty()
    @Expose()
    creatorUID: number

    @ApiProperty()
    @Expose()
    notes: string

    @ApiProperty()
    @Expose()
    initialTimestamp: Date

}
