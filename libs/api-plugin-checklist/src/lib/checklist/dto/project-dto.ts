import { Exclude, Expose, Type } from 'class-transformer';
import { Checklist, ChecklistProjectLink, Project } from '@symbiota2/api-database';
import { ApiProperty } from '@nestjs/swagger';
import { ChecklistCreateDto } from './checklist-create.dto';
import { ChecklistDto } from './checklist-dto';
// import { TaxonomicStatusDto } from '../../taxonomicStatus/dto/TaxonomicStatusDto';

@Exclude()
export class ProjectDto {
    constructor(project: Project) {
        Object.assign(this, project);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    managers: string;

    @ApiProperty()
    @Expose()
    fullDescription: string;

    @ApiProperty()
    @Expose()
    checklist: Promise<ChecklistDto[]>

    @ApiProperty()
    @Expose()
    clids: number[]
}