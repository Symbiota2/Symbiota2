import { AddDeterminationTempUpload } from './DeterminationTempUpload.entity';
import { GlossaryUpload } from './GlossaryUpload.entity';
import { ImageTempUpload } from './ImageTempUpload.entity';
import { TaxonUpload } from './TaxonUpload.entity'
import { OccurrenceUpload } from './OccurrenceUpload.entity';
import { TaxonomyUpload } from '@symbiota2/api-database';

export const providers = [
    AddDeterminationTempUpload.getProvider<AddDeterminationTempUpload>(),
    GlossaryUpload.getProvider<GlossaryUpload>(),
    ImageTempUpload.getProvider<ImageTempUpload>(),
    TaxonUpload.getProvider<TaxonUpload>(),
    OccurrenceUpload.getProvider<OccurrenceUpload>(),
    TaxonomyUpload.getProvider<TaxonomyUpload>()
];
