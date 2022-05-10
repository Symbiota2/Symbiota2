import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ChecklistTaxonLink } from '@symbiota2/api-database';
import { ChecklistTaxonDto } from './checklist-taxon.dto';

@Exclude()
export class ChecklistTaxonLinkDto {
    constructor(checklistTaxonLink: ChecklistTaxonLink) {
        Object.assign(this, checklistTaxonLink);
    }

    @ApiProperty()
    @Expose()
    scientificName: string;

    @ApiProperty()
    @Expose()
    taxonID: number;

    @ApiProperty()
    @Expose()
    checklistID: number;

    @ApiProperty()
    @Expose()
    morphoSpecies: string;

    @ApiProperty()
    @Expose()
    familyOverride: string;

    @ApiProperty()
    @Expose()
    habitat: string;

    @ApiProperty()
    @Expose()
    abundance: string;

    @ApiProperty()
    @Expose()
    notes: string;

    @ApiProperty()
    @Expose()
    internalNotes: string;

    @ApiProperty()
    @Expose()
    source: string;

    // @ApiProperty()
    // @Expose()
    // taxon: ChecklistTaxonDto[];
}
