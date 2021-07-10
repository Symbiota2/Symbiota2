import { Collection } from './Collection.entity';
import { CollectionCategory } from './CollectionCategory.entity';
import { CollectionCategoryLink } from './CollectionCategoryLink.entity';
import { CollectionStat } from './CollectionStat.entity';
import { Institution } from '@symbiota2/api-database';

export const providers = [
    Institution.getProvider<Institution>(),
    Collection.getProvider<Collection>(),
    CollectionCategory.getProvider<CollectionCategory>(),
    CollectionCategoryLink.getProvider<CollectionCategoryLink>(),
    CollectionStat.getProvider<CollectionStat>(),
];
