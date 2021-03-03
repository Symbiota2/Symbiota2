import { Collection } from './Collection.entity';
import { CollectionCategory } from './CollectionCategory.entity';
import { CollectionCategoryLink } from './CollectionCategoryLink.entity';
import { CollectionContact } from './CollectionContact.entity';
import { CollectionPublication } from './CollectionPublication.entity';
import { CollectionPublicationOccurrenceLink } from './CollectionPublicationOccurrenceLink.entity';
import { CollectionStat } from './CollectionStat.entity';
import { SecondaryCollection } from './SecondaryCollection.entity'

export const providers = [
    Collection.getProvider<Collection>(),
    CollectionCategory.getProvider<CollectionCategory>(),
    CollectionCategoryLink.getProvider<CollectionCategoryLink>(),
    CollectionContact.getProvider<CollectionContact>(),
    CollectionPublication.getProvider<CollectionPublication>(),
    CollectionPublicationOccurrenceLink.getProvider<CollectionPublicationOccurrenceLink>(),
    CollectionStat.getProvider<CollectionStat>(),
    SecondaryCollection.getProvider<SecondaryCollection>()
];
