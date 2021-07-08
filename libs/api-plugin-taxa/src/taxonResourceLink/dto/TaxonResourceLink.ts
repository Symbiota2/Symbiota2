import { Exclude, Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

@Exclude()
export class TaxonResourceLink {
    constructor(taxonResourceLink: TaxonResourceLink) {
        Object.assign(this, taxonResourceLink)
    }

    @ApiProperty()
    @Expose()
    id: number

    @ApiProperty()
    @Expose()
    taxonID: number

    @ApiProperty()
    @Expose()
    sourceName: string

    @ApiProperty()
    @Expose()
    sourceIdentifier: string | null

    @ApiProperty()
    @Expose()
    sourceGUID: string | null

    @ApiProperty()
    @Expose()
    url: string | null

    @ApiProperty()
    @Expose()
    notes: string | null

    @ApiProperty()
    @Expose()
    ranking: number | null

    @ApiProperty()
    @Expose()
    initialTimestamp: Date

}
