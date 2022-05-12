import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Taxon } from '@symbiota2/api-database';

@Exclude()
export class ChecklistTaxonDto {
    constructor(taxon: Taxon) {
        Object.assign(this, taxon);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    kingdomName: string;

    @ApiProperty()
    @Expose()
    rankID: number | null;

    @ApiProperty()
    @Expose()
    scientificName: string;
}