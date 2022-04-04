import { Exclude, Expose, Type } from 'class-transformer';
import { Project } from '@symbiota2/api-database';
import { ApiProperty } from '@nestjs/swagger';
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
}
