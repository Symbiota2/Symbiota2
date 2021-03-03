import { Reference } from './Reference.entity';
import { ReferenceAgentLink } from './ReferenceAgentLink.entity';
import { ReferenceAuthor } from './ReferenceAuthor.entity';
import { ReferenceAuthorLink } from './ReferenceAuthorLink.entity';
import { ReferenceChecklistLink } from './ReferenceChecklistLink.entity';
import { ReferenceChecklistTaxonLink } from './ReferenceChecklistTaxonLink.entity';
import { ReferenceCollectionLink } from './ReferenceCollectionLink.entity';
import { ReferenceOccurrenceLink } from './ReferenceOccurrenceLink.entity';
import { ReferenceTaxonLink } from './ReferenceTaxonLink.entity';
import { ReferenceType } from './ReferenceType.entity'

export const providers = [
    Reference.getProvider<Reference>(),
    ReferenceAgentLink.getProvider<ReferenceAgentLink>(),
    ReferenceAuthor.getProvider<ReferenceAuthor>(),
    ReferenceAuthorLink.getProvider<ReferenceAuthorLink>(),
    ReferenceChecklistLink.getProvider<ReferenceChecklistLink>(),
    ReferenceChecklistTaxonLink.getProvider<ReferenceChecklistTaxonLink>(),
    ReferenceCollectionLink.getProvider<ReferenceCollectionLink>(),
    ReferenceOccurrenceLink.getProvider<ReferenceOccurrenceLink>(),
    ReferenceTaxonLink.getProvider<ReferenceTaxonLink>(),
    ReferenceType.getProvider<ReferenceType>()
];
