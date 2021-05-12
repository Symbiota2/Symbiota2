import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
    ApiOccurrenceList,
    ApiOccurrenceListItem
} from '@symbiota2/data-access';
import { CollectionListItem } from '@symbiota2/api-plugin-collection';

@Exclude()
export class OccurrenceListItem implements ApiOccurrenceListItem {
    constructor(occurrence: ApiOccurrenceListItem) {
        Object.assign(this, occurrence);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty({ type: CollectionListItem })
    @Expose()
    @Type(() => CollectionListItem)
    collection: CollectionListItem;

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

@Exclude()
export class OccurrenceList implements ApiOccurrenceList {
    constructor(count: number, data: ApiOccurrenceListItem[]) {
        this.count = count;
        this.data = data.map((o) => new OccurrenceListItem(o));
    }

    @ApiProperty()
    @Expose()
    count: number;

    @ApiProperty({ type: OccurrenceListItem, isArray: true })
    @Expose()
    @Type(() => OccurrenceListItem)
    data: OccurrenceListItem[];
}
