
import { SpeciesProcessorNLP } from './SpeciesProcessorNLP.entity';
import { SpeciesProcessorNLPFrag } from './SpeciesProcessorNLPFrag.entity';
import { SpeciesProcessorNLPVersion } from './SpeciesProcessorNLPVersion.entity';
import { SpeciesProcessorOCRFragment } from './SpeciesProcessorOCRFragment.entity';
import { SpeciesProcessorProject } from './SpeciesProcessorProject.entity';
import { SpeciesProcessorRawLabel } from './SpeciesProcessorRawLabel.entity';
import { SpeciesProcessorRawLabelsFullText } from './SpeciesProcessorRawLabelsFullText.entity'
        
export const providers = [
    SpeciesProcessorNLP.getProvider<SpeciesProcessorNLP>(),
    SpeciesProcessorNLPFrag.getProvider<SpeciesProcessorNLPFrag>(),
    SpeciesProcessorNLPVersion.getProvider<SpeciesProcessorNLPVersion>(),
    SpeciesProcessorOCRFragment.getProvider<SpeciesProcessorOCRFragment>(),
    SpeciesProcessorProject.getProvider<SpeciesProcessorProject>(),
    SpeciesProcessorRawLabel.getProvider<SpeciesProcessorRawLabel>(),
    SpeciesProcessorRawLabelsFullText.getProvider<SpeciesProcessorRawLabelsFullText>()
];
