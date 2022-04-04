import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TaxonIDandNameDto {
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    name: string;
}
