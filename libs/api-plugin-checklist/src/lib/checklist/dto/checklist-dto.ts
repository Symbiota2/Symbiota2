import { Exclude, Expose, Type } from 'class-transformer';
import { Checklist, ChecklistProjectLink, Project } from '@symbiota2/api-database';
import { ApiProperty } from '@nestjs/swagger';
import { ChecklistCreateDto } from './checklist-create.dto';
// import { TaxonomicStatusDto } from '../../taxonomicStatus/dto/TaxonomicStatusDto';

@Exclude()
export class ChecklistDto {
    constructor(checklist: Checklist) {
        Object.assign(this, checklist);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    title: string;

    @ApiProperty()
    @Expose()
    locality: string;

    @ApiProperty()
    @Expose()
    publication: string;

    @ApiProperty()
    @Expose()
    abstract: string;

    @ApiProperty()
    @Expose()
    authors: string;

    @ApiProperty()
    @Expose()
    type: string;

}