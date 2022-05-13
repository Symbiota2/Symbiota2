import { Exclude, Expose, Type } from 'class-transformer';
import { Checklist, ChecklistProjectLink, ChecklistTaxonLink, Project } from '@symbiota2/api-database';
import { ApiProperty } from '@nestjs/swagger';
import { ChecklistCreateDto } from './checklist-create.dto';
import { ChecklistTaxonLinkDto } from './checklist-taxon-link.dto';
// import { TaxonomicStatusDto } from '../../taxonomicStatus/dto/TaxonomicStatusDto';

@Exclude()
export class ChecklistDto {
    constructor(checklist: Checklist) {
        Object.assign(this, checklist);
    }

    @ApiProperty()
    @Expose()
    id: number

    @ApiProperty()
    @Expose()
    name: string

    @ApiProperty()
    @Expose()
    title: string

    @ApiProperty()
    @Expose()
    locality: string

    @ApiProperty()
    @Expose()
    publication: string

    @ApiProperty()
    @Expose()
    abstract: string

    @ApiProperty()
    @Expose()
    authors: string

    @ApiProperty()
    @Expose()
    type: string

    @ApiProperty()
    @Expose()
    politicalDivision: string

    @ApiProperty()
    @Expose()
    dynamicSQL: string

    @ApiProperty()
    @Expose()
    parentName: string

    @ApiProperty()
    @Expose()
    parentChecklistID: number | null

    @ApiProperty()
    @Expose()
    notes: string

    @ApiProperty()
    @Expose()
    latCentroid: number | null

    @ApiProperty()
    @Expose()
    longCentroid: number | null

    @ApiProperty()
    @Expose()
    pointRadiusMeters: number | null

    @ApiProperty()
    @Expose()
    footprintWKT: string

    @ApiProperty()
    @Expose()
    percentEffort: number | null;

    @ApiProperty()
    @Expose()
    access: string

    @ApiProperty()
    @Expose()
    defaultSettings: string

    @ApiProperty()
    @Expose()
    iconUrl: string

    @ApiProperty()
    @Expose()
    headerUrl: string

    @ApiProperty()
    @Expose()
    creatorUID: number | null;

    @ApiProperty()
    @Expose()
    sortSequence: number;

    @ApiProperty()
    @Expose()
    expirationi: number | null

    @ApiProperty()
    @Expose()
    modifiedTimestamp: Date;

    @ApiProperty()
    @Expose()
    initialTimeStamp: Date;

    @ApiProperty()
    @Expose()
    taxaLinks: ChecklistTaxonLinkDto;

}