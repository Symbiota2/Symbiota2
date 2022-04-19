import { Exclude, Expose, Type } from 'class-transformer';
import { Checklist, ChecklistProjectLink, Project } from '@symbiota2/api-database';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from './project-dto';
import { NullTemplateVisitor } from '@angular/compiler';
import { ChecklistDto } from './checklist-dto';
import { IsOptional } from 'class-validator';
// import { TaxonomicStatusDto } from '../../taxonomicStatus/dto/TaxonomicStatusDto';

@Exclude()
export class ProjectLinkDto {
    constructor(projectLink: ChecklistProjectLink) {
        Object.assign(this, projectLink);
    }

    @ApiProperty()
    @Expose()
    projectID: number;

    @ApiProperty()
    @Expose()
    checklistID: number;

}
