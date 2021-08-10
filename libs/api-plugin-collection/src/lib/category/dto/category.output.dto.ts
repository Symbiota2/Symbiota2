import { Exclude, Expose, Type } from 'class-transformer';
import {
    Collection,
    CollectionCategory
} from '@symbiota2/api-database';
import { ApiProperty } from '@nestjs/swagger';
import { ApiCollectionCategoryOutput } from '@symbiota2/data-access';

@Exclude()
export class CategoryOutputDto implements ApiCollectionCategoryOutput {
    @ApiProperty()
    @Expose()
    id: number;

    @ApiProperty()
    @Expose()
    category: string;

    @ApiProperty()
    @Expose()
    icon: string;

    @ApiProperty({ type: Collection, isArray: true })
    @Expose()
    @Type(() => Collection)
    collections: Collection[] = [];

    constructor(category: CollectionCategory) {
        Object.assign(this, category);
    }
}
