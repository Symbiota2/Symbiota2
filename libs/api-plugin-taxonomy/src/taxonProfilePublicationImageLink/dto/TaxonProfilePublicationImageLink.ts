import { Exclude, Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { Column } from 'typeorm';

@Exclude()
export class TaxonProfilePublicationImageLink {
    constructor(taxonProfilePublicationImageLink: TaxonProfilePublicationImageLink) {
        Object.assign(this, taxonProfilePublicationImageLink)
    }

    @ApiProperty()
    @Expose()
    imageID: number

    @ApiProperty()
    @Expose()
    publicationID: number

    @ApiProperty()
    @Expose()
    caption: string

    @ApiProperty()
    @Expose()
    editorNotes: string

    @ApiProperty()
    @Expose()
    sortSequence: number | null

    @ApiProperty()
    @Expose()
    initialTimestamp: Date | null

}
