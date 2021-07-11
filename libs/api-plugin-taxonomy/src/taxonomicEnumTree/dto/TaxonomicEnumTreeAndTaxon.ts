import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TaxonomicEnumTreeAndTaxon {
    constructor(tree: TaxonomicEnumTreeAndTaxon) {
        Object.assign(this, tree);
    }

    @ApiProperty()
    @Expose()
    taxonID: number;

    @ApiProperty()
    @Expose()
    taxonAuthorityID: number;

    @ApiProperty()
    @Expose()
    parentTaxonID: number;

    @ApiProperty()
    @Expose()
    kingdomName: string;

    @ApiProperty()
    @Expose()
    rankID: number | null;

    @ApiProperty()
    @Expose()
    scientificName: string;

    @ApiProperty()
    @Expose()
    initialTimestamp: Date;

}
