import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { TaxonDescriptionStatementDto } from '../../taxonDescriptionStatement/dto/TaxonDescriptionStatementDto';
import { Taxon, TaxonDescriptionBlock } from '@symbiota2/api-database';
import { TaxonDto } from '../../taxon/dto/TaxonDto';
import { ImageDto } from '../../../../api-plugin-image/src/image/dto/ImageDto';
import { ApiCollectionInput } from '@symbiota2/data-access';

@Exclude()
export class TaxonDescriptionBlockInputDto {
    /*
    constructor(taxonDescriptionBlock: TaxonDescriptionBlock) {
        Object.assign(this, taxonDescriptionBlock)
    }
     */

    @ApiProperty({ required: false })
    @Expose()
    id: number

    @ApiProperty()
    @Expose()
    taxonID: number

    @ApiProperty({ required: false })
    @Expose()
    caption: string

    @ApiProperty({ required: false })
    @Expose()
    source: string

    @ApiProperty({ required: false })
    @Expose()
    sourceUrl: string

    @ApiProperty({ required: false })
    @Expose()
    language: string

    @ApiProperty({ required: false })
    @Expose()
    adminLanguageID: number | null

    @ApiProperty({ required: false })
    @Expose()
    displayLevel: number

    @ApiProperty({ required: false })
    @Expose()
    creatorUID: number

    @ApiProperty({ required: false })
    @Expose()
    notes: string

    @ApiProperty({ required: false })
    @Expose()
    initialTimestamp: Date

}
