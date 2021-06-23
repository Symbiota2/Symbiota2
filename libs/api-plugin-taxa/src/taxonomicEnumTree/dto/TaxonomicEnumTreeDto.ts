import { Exclude, Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { Taxon } from '@symbiota2/api-database'
import { TaxonDto } from '../../taxon/dto/TaxonDto'

@Exclude()
export class TaxonomicEnumTreeDto {
    constructor(taxaEnumTree: TaxonomicEnumTreeDto) {
        Object.assign(this, taxaEnumTree)
    }

    @ApiProperty()
    @Expose()
    taxonID: number

    @ApiProperty()
    @Expose()
    taxonAuthorityID: number

    @ApiProperty()
    @Expose()
    parentTaxonID: number

    @ApiProperty()
    @Expose()
    taxon: Promise<Taxon>

    @ApiProperty()
    @Expose()
    parentTaxon: Promise<Taxon>

    @ApiProperty()
    @Expose()
    parent : TaxonDto

    @ApiProperty()
    @Expose()
    initialTimestamp: Date

}
