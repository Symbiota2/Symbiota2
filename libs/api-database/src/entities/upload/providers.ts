import { AddDeterminationTempUpload } from './DeterminationTempUpload.entity';
import { GlossaryUpload } from './GlossaryUpload.entity';
import { ImageTempUpload } from './ImageTempUpload.entity';
import { ImageFolderUpload } from './ImageFolderUpload.entity';
import { TaxonomyUpload } from './TaxonomyUpload.entity'
import { TaxonUpload } from './TaxonUpload.entity'
import { OccurrenceUpload } from './OccurrenceUpload.entity';

export const providers = [
    AddDeterminationTempUpload.getProvider<AddDeterminationTempUpload>(),
    GlossaryUpload.getProvider<GlossaryUpload>(),
    ImageTempUpload.getProvider<ImageTempUpload>(),
    ImageFolderUpload.getProvider<ImageFolderUpload>(),
    TaxonUpload.getProvider<TaxonUpload>(),
    OccurrenceUpload.getProvider<OccurrenceUpload>(),
    TaxonomyUpload.getProvider<TaxonomyUpload>()
];
