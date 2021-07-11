import { Exclude, Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { Column } from 'typeorm';

@Exclude()
export class TaxonProfilePublicationDescriptionLink {
    constructor(taxonProfilePublicationDescriptionLink: TaxonProfilePublicationDescriptionLink) {
        Object.assign(this, taxonProfilePublicationDescriptionLink)
    }

    @ApiProperty()
    @Expose()
    descriptionBlockID: number

    @ApiProperty()
    @Expose()
    publicationID: number

    @ApiProperty()
    @Expose()
    caption: string | null

    @ApiProperty()
    @Expose()
    editorNotes: string | null

    @ApiProperty()
    @Expose()
    sortSequence: number | null

    @ApiProperty()
    @Expose()
    initialTimestamp: Date | null


}
