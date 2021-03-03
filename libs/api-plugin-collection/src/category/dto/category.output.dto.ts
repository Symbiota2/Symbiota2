import { Exclude, Expose, Type } from 'class-transformer';
import {
    Collection,
    CollectionCategory
} from '@symbiota2/api-database';
import { ApiProperty } from '@nestjs/swagger';
import { CollectionListItem } from '../../collection/dto/CollectionListItem.output.dto';

@Exclude()
export class CategoryOutputDto {
    // TODO: Serialization groups
    public static readonly GROUP_LIST = 'list';
    public static readonly GROUP_SINGLE = 'single';

    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    category: string;

    @ApiProperty()
    @Expose()
    icon: string;

    @ApiProperty({ type: CollectionListItem, isArray: true })
    @Expose()
    @Type(() => CollectionListItem)
    collections: CollectionListItem[] = [];

    constructor(category: CollectionCategory) {
        Object.assign(this, category);
    }
}
