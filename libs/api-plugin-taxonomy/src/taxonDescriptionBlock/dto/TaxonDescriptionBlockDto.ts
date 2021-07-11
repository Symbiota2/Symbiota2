import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { TaxonDescriptionStatementDto } from '../../taxonDescriptionStatement/dto/TaxonDescriptionStatementDto';
import { Taxon, TaxonDescriptionBlock } from '@symbiota2/api-database';
import { TaxonDto } from '../../taxon/dto/TaxonDto';
import { ImageDto } from '../../../../api-plugin-image/src/image/dto/ImageDto';

@Exclude()
export class TaxonDescriptionBlockDto {
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

    @ApiProperty()
    @Expose()
    descriptionStatements: TaxonDescriptionStatementDto[] | null

    @ApiProperty()
    @Expose()
    taxon: TaxonDto | null

    @ApiProperty()
    @Expose()
    images: ImageDto[] | null
}
