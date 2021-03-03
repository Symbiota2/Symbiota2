import { ExsiccatiNumber } from './ExsiccatiNumber.entity';
import { ExsiccatiOccurrenceLink } from './ExsiccatiOccurrenceLink.entity';
import { ExsiccatiTitle } from './ExsiccatiTitle.entity'

export const providers = [
    ExsiccatiNumber.getProvider<ExsiccatiNumber>(),
    ExsiccatiOccurrenceLink.getProvider<ExsiccatiOccurrenceLink>(),
    ExsiccatiTitle.getProvider<ExsiccatiTitle>()
];
