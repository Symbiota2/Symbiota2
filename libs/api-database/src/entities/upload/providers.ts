import { AddDeterminationTempUpload } from './DeterminationTempUpload.entity';
import { GlossaryUpload } from './GlossaryUpload.entity';
import { ImageTempUpload } from './ImageTempUpload.entity';
import { SpeciesMapUpload } from './SpeciesMapUpload.entity';
import { SpeciesUploadParameter } from './SpeciesUploadParameter.entity';
import { SpeciesUploadTemp } from './SpeciesUploadTemp.entity';
import { TaxonUpload } from './TaxonUpload.entity'

export const providers = [
    AddDeterminationTempUpload.getProvider<AddDeterminationTempUpload>(),
    GlossaryUpload.getProvider<GlossaryUpload>(),
    ImageTempUpload.getProvider<ImageTempUpload>(),
    SpeciesMapUpload.getProvider<SpeciesMapUpload>(),
    SpeciesUploadParameter.getProvider<SpeciesUploadParameter>(),
    SpeciesUploadTemp.getProvider<SpeciesUploadTemp>(),
    TaxonUpload.getProvider<TaxonUpload>()
];
