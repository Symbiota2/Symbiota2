import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Taxon } from '@symbiota2/api-database';


@Exclude()
export class TaxonInputDto {

    constructor(taxa: Partial<TaxonInputDto>) {
        Object.assign(this, taxa);
    }

    @ApiProperty()
    @Expose()
    id: number

    @ApiProperty()
    @Expose()
    kingdomName: string

    @ApiProperty()
    @Expose()
    rankID: number | null

    @ApiProperty()
    @Expose()
    scientificName: string

    @ApiProperty()
    @Expose()
    unitInd1: string

    @ApiProperty()
    @Expose()
    unitName1: string

    @ApiProperty()
    @Expose()
    unitInd2: string

    @ApiProperty()
    @Expose()
    unitName2: string

    @ApiProperty()
    @Expose()
    unitInd3: string

    @ApiProperty()
    @Expose()
    unitName3: string

    @ApiProperty()
    @Expose()
    author: string

    @ApiProperty()
    @Expose()
    phyloSortSequence: number | null

    @ApiProperty()
    @Expose()
    status: string

    @ApiProperty()
    @Expose()
    source: string

    @ApiProperty()
    @Expose()
    notes: string

    @ApiProperty()
    @Expose()
    hybrid: string

    @ApiProperty()
    @Expose()
    securityStatus: number

    @ApiProperty()
    @Expose()
    lastModifiedUID: number | null

    @ApiProperty()
    @Expose()
    lastModifiedTimestamp: Date | null

    @ApiProperty()
    @Expose()
    initialTimestamp: Date
}
