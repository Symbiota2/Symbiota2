import { Glossary } from './Glossary.entity';
import { GlossaryImage } from './GlossaryImage.entity';
import { GlossarySource } from './GlossarySource.entity';
import { GlossaryTaxonLink } from './GlossaryTaxonLink.entity';
import { GlossaryTermLink } from './GlossaryTermLink.entity'

export const providers = [
    Glossary.getProvider<Glossary>(),
    GlossaryImage.getProvider<GlossaryImage>(),
    GlossarySource.getProvider<GlossarySource>(),
    GlossaryTaxonLink.getProvider<GlossaryTaxonLink>(),
    GlossaryTermLink.getProvider<GlossaryTermLink>()
];
