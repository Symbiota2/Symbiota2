import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TaxonDto } from '../../taxon/dto/TaxonDto';
import { TaxonomicStatus } from '@symbiota2/api-database';

@Exclude()
export class TaxonomicStatusDto {
    constructor(taxaStatus: TaxonomicStatus) {
        Object.assign(this, taxaStatus);
    }

    @ApiProperty()
    @Expose()
    taxonID: number;

    @ApiProperty()
    @Expose()
    taxonIDAccepted: number;

    @ApiProperty()
    @Expose()
    taxonAuthorityID: number;

    @ApiProperty()
    @Expose()
    parentTaxonID: number | null;

    @ApiProperty()
    @Expose()
    hierarchyStr: string | null;

    @ApiProperty()
    @Expose()
    family: string | null;

    @ApiProperty()
    @Expose()
    unacceptabilityReason: string | null;

    @ApiProperty()
    @Expose()
    notes: string | null;

    @ApiProperty()
    @Expose()
    initialTimestamp: Date;

    @ApiProperty()
    @Expose()
    children: TaxonomicStatusDto[]

    @ApiProperty()
    @Expose()
    parent: TaxonDto | null

    @ApiProperty()
    @Expose()
    taxon: TaxonDto | null

}
