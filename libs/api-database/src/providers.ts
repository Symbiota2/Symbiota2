import { providers as collectionProviders } from './entities/collection/providers';
import { providers as geoThesaurusProviders } from './entities/geo-thesaurus/providers';
import { providers as occurrenceProviders } from './entities/occurrence/providers';
import { providers as taxonProviders } from './entities/taxonomy/providers';
import { providers as userProviders } from './entities/user/providers';

/**
 * List of database entities that extend EntityProvider. Because of this they
 * can be used as NestJS providers and are registered in database.module.ts
 */
export const entityProviders = [
    ...collectionProviders,
    ...geoThesaurusProviders,
    ...occurrenceProviders,
    ...taxonProviders,
    ...userProviders,
];
