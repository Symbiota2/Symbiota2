import { ApiCollectionListItem } from './collection';

export interface ApiCollectionCategoryOutput {
    id: number;
    category: string;
    icon: string;
    collections: ApiCollectionListItem[];
}

export interface ApiCollectionIDBody {
    collectionID: number;
}
