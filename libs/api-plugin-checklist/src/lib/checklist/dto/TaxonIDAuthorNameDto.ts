import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TaxonIDAuthorNameDto {
    constructor(id: number, name: string, author: string) {
        this.id = id
        this.name = name
        this.author = author
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    author: string | null
}
