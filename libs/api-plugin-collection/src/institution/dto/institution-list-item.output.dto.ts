import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Institution } from "@symbiota2/api-database";

@Exclude()
export class InstitutionListItem {
    constructor(institution: Institution) {
        Object.assign(this, institution);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    name: string;
}
