import { Exclude, Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

@Exclude()
export class TaxonLink {
    constructor(taxonLink: TaxonLink) {
        Object.assign(this, taxonLink)
    }

    @ApiProperty()
    @Expose()
    id: number

    @ApiProperty()
    @Expose()
    taxonID: number

    @ApiProperty()
    @Expose()
    url: string

    @ApiProperty()
    @Expose()
    title: string

    @ApiProperty()
    @Expose()
    sourceIdentifier: string | null

    @ApiProperty()
    @Expose()
    owner: string | null

    @ApiProperty()
    @Expose()
    icon: string | null

    @ApiProperty()
    @Expose()
    inherit: number | null

    @ApiProperty()
    @Expose()
    notes: string | null

    @ApiProperty()
    @Expose()
    sortSequence: number

    @ApiProperty()
    @Expose()
    initialTimestamp: Date

}
