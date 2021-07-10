import { TaxaEnumTreeEntry } from './TaxaEnumTreeEntry.entity';
import { Taxon } from './Taxon.entity';
import { TaxonDescriptionBlock } from './TaxonDescriptionBlock.entity';
import { TaxonDescriptionStatement } from './TaxonDescriptionStatement.entity';
import { TaxonLink } from './TaxonLink.entity';
import { TaxonomicAuthority } from './TaxonomicAuthority.entity';
import { TaxonomicStatus } from './TaxonomicStatus.entity';
import { TaxonomicUnit } from './TaxonomicUnit.entity';
import { TaxonProfilePublication } from './TaxonProfilePublication.entity';
import { TaxonProfilePublicationDescriptionLink } from './TaxonProfilePublicationDescriptionLink.entity';
import { TaxonProfilePublicationImageLink } from './TaxonProfilePublicationImageLink.entity';
import { TaxonResourceLink } from './TaxonResourceLink.entity';
import { TaxonVernacular } from './TaxonVernacular.entity';

export const providers = [
    TaxaEnumTreeEntry.getProvider<TaxaEnumTreeEntry>(),
    Taxon.getProvider<Taxon>(),
    TaxonDescriptionBlock.getProvider<TaxonDescriptionBlock>(),
    TaxonDescriptionStatement.getProvider<TaxonDescriptionStatement>(),
    TaxonLink.getProvider<TaxonLink>(),
    TaxonomicAuthority.getProvider<TaxonomicAuthority>(),
    TaxonomicStatus.getProvider<TaxonomicStatus>(),
    TaxonomicUnit.getProvider<TaxonomicUnit>(),
    TaxonProfilePublication.getProvider<TaxonProfilePublication>(),
    TaxonProfilePublicationDescriptionLink.getProvider<TaxonProfilePublicationDescriptionLink>(),
    TaxonProfilePublicationImageLink.getProvider<TaxonProfilePublicationImageLink>(),
    TaxonResourceLink.getProvider<TaxonResourceLink>(),
    TaxonVernacular.getProvider<TaxonVernacular>(),
];
