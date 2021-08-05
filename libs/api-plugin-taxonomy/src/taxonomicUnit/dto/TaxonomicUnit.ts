import { Exclude, Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

@Exclude()
export class TaxonomicUnit {
    constructor(taxaUnit: TaxonomicUnit) {
        Object.assign(this, taxaUnit)
    }

    @ApiProperty()
    @Expose()
    id: number

    @ApiProperty()
    @Expose()
    kingdomName: string

    @ApiProperty()
    @Expose()
    rankID: number

    @ApiProperty()
    @Expose()
    rankName: string

    @ApiProperty()
    @Expose()
    suffix: string

    @ApiProperty()
    @Expose()
    directParentRankID: number

    @ApiProperty()
    @Expose()
    reqParentRankID: number | null

    @ApiProperty()
    @Expose()
    lastModifiedBy: string

    @ApiProperty()
    @Expose()
    lastModifiedTimestamp: Date | null

    @ApiProperty()
    @Expose()
    initialTimestamp: Date

}
