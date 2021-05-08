import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ApiOccurrenceListItem } from '@symbiota2/data-access';

@Exclude()
export class OccurrenceListOutputDto implements ApiOccurrenceListItem {
    constructor(occurrence: ApiOccurrenceListItem) {
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
