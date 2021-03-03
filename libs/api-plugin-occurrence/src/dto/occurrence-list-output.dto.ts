import { ApiProperty } from '@nestjs/swagger';
import { Occurrence } from '@symbiota2/api-database';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OccurrenceListOutputDto {
    constructor(occurrence: Occurrence) {
        Object.assign(this, occurrence);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    collectionID: number;

    @ApiProperty()
    @Expose()
    catalogNumber: string;

    @ApiProperty()
    @Expose()
    taxonID: number;

    @ApiProperty()
    @Expose()
    sciname: string;

    @ApiProperty()
    @Expose()
    latitude: number;

    @ApiProperty()
    @Expose()
    longitude: number;
}
