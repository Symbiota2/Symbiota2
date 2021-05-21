import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ApiCollectionListItem } from '@symbiota2/data-access';

@Exclude()
export class CollectionListItem implements ApiCollectionListItem {
    constructor(data: ApiCollectionListItem) {
        Object.assign(this, data);
    }

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    collectionName: string;

    @ApiProperty()
    @Expose()
    icon: string;

    @ApiProperty()
    @Expose()
    email: string;
}
