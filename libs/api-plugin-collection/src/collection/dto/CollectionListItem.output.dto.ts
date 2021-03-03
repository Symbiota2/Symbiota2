import { ApiProperty } from '@nestjs/swagger';
import { Collection } from '@symbiota2/api-database';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CollectionListItem {
    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    collectionName: string;

    @ApiProperty()
    @Expose()
    icon: string;

    constructor(collection: Collection) {
        Object.assign(this, collection);
    }
}
