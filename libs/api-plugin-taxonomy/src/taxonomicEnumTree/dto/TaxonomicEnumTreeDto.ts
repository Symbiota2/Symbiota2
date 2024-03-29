import { Exclude, Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { TaxaEnumTreeEntry, Taxon } from '@symbiota2/api-database';
import { TaxonDto } from '../../taxon/dto/TaxonDto'
import { TaxonAndAcceptedStatusesDto } from '../../taxon/dto/TaxonAndAcceptedStatusesDto';

@Exclude()
export class TaxonomicEnumTreeDto {
    constructor(taxaEnumTree: TaxaEnumTreeEntry) {
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
    taxon: TaxonDto

    @ApiProperty()
    @Expose()
    parentTaxon: Promise<Taxon>

    @ApiProperty()
    @Expose()
    parent : TaxonAndAcceptedStatusesDto

    @ApiProperty()
    @Expose()
    initialTimestamp: Date

}
