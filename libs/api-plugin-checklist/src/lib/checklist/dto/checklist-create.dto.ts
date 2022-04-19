import { Exclude, Expose, Type } from 'class-transformer';
import { Checklist } from '@symbiota2/api-database';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ChecklistCreateDto {
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
    managers: string;

    @ApiProperty()
    @Expose()
    fullDescription: string;
}
