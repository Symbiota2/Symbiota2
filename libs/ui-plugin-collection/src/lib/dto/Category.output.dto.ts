import {
    ApiCollectionCategoryOutput, ApiCollectionIDBody,
} from '@symbiota2/data-access';
import { CollectionListItem } from './Collection.output.dto';

export class CollectionCategory implements ApiCollectionCategoryOutput {
    constructor(category: ApiCollectionCategoryOutput) {
        Object.assign(this, category);
        this.collections = category.collections.map((c) => new CollectionListItem(c));
    }

    id: number;
    category: string;
    icon: string;
    collections: CollectionListItem[];
}

export class CollectionIDBody implements ApiCollectionIDBody {
    constructor(collectionID: number) {
        this.collectionID = collectionID;
    }

    collectionID: number;
}
