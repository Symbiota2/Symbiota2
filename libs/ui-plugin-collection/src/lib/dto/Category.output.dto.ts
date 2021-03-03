import { Exclude, Expose, plainToClass, Type } from 'class-transformer';
import { CollectionListItem } from './Collection.output.dto';

@Exclude()
export class CollectionCategory {
    constructor(category: Record<string, unknown>) {
        const asCls = plainToClass(CollectionCategory, category);
        Object.assign(this, asCls);
    }

    @Expose()
    id: number;

    @Expose()
    category: string;

    @Expose()
    icon: string;

    @Expose()
    @Type(() => CollectionListItem)
    collections: CollectionListItem[];
}
