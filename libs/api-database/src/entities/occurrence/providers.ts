
import { FullTextOccurrence } from './FullTextOccurrence.entity';
import { GuidOccurenceDetermination } from './GuidOccurenceDetermination.entity';
import { GuidOccurrence } from './GuidOccurrence.entity';
import { Occurrence } from './Occurrence.entity';
import { OccurrenceAccessStat } from './OccurrenceAccessStat.entity';
import { OccurrenceAssociation } from './OccurrenceAssociation.entity';
import { OccurrenceComment } from './OccurrenceComment.entity';
import { OccurrenceDataset } from './OccurrenceDataset.entity';
import { OccurrenceDatasetLink } from './OccurrenceDatasetLink.entity';
import { OccurrenceDetermination } from './OccurrenceDetermination.entity';
import { OccurrenceDuplicate } from './OccurrenceDuplicate.entity';
import { OccurrenceDuplicateLink } from './OccurrenceDuplicateLink.entity';
import { OccurrenceEdit } from './OccurrenceEdit.entity';
import { OccurrenceEditLock } from './OccurrenceEditLock.entity';
import { OccurrenceExchange } from './OccurrenceExchange.entity';
import { OccurrenceGenetic } from './OccurrenceGenetic.entity';
import { OccurrenceGeoIndex } from './OccurrenceGeoIndex.entity';
import { OccurrenceIdentifier } from './OccurrenceIdentifier.entity';
import { OccurrenceLithostratigraphy } from './OccurrenceLithostratigraphy.entity';
import { OccurrenceLoan } from './OccurrenceLoan.entity';
import { OccurrenceLoanLink } from './OccurrenceLoanLink.entity';
import { OccurrencePoint } from './OccurrencePoint.entity';
import { OccurrenceRevision } from './OccurrenceRevision.entity';
import { OccurrenceType } from './OccurrenceType.entity';
import { OccurrenceVerification } from './OccurrenceVerification.entity'
        
export const providers = [
    FullTextOccurrence.getProvider<FullTextOccurrence>(),
    GuidOccurenceDetermination.getProvider<GuidOccurenceDetermination>(),
    GuidOccurrence.getProvider<GuidOccurrence>(),
    Occurrence.getProvider<Occurrence>(),
    OccurrenceAccessStat.getProvider<OccurrenceAccessStat>(),
    OccurrenceAssociation.getProvider<OccurrenceAssociation>(),
    OccurrenceComment.getProvider<OccurrenceComment>(),
    OccurrenceDataset.getProvider<OccurrenceDataset>(),
    OccurrenceDatasetLink.getProvider<OccurrenceDatasetLink>(),
    OccurrenceDetermination.getProvider<OccurrenceDetermination>(),
    OccurrenceDuplicate.getProvider<OccurrenceDuplicate>(),
    OccurrenceDuplicateLink.getProvider<OccurrenceDuplicateLink>(),
    OccurrenceEdit.getProvider<OccurrenceEdit>(),
    OccurrenceEditLock.getProvider<OccurrenceEditLock>(),
    OccurrenceExchange.getProvider<OccurrenceExchange>(),
    OccurrenceGenetic.getProvider<OccurrenceGenetic>(),
    OccurrenceGeoIndex.getProvider<OccurrenceGeoIndex>(),
    OccurrenceIdentifier.getProvider<OccurrenceIdentifier>(),
    OccurrenceLithostratigraphy.getProvider<OccurrenceLithostratigraphy>(),
    OccurrenceLoan.getProvider<OccurrenceLoan>(),
    OccurrenceLoanLink.getProvider<OccurrenceLoanLink>(),
    OccurrencePoint.getProvider<OccurrencePoint>(),
    OccurrenceRevision.getProvider<OccurrenceRevision>(),
    OccurrenceType.getProvider<OccurrenceType>(),
    OccurrenceVerification.getProvider<OccurrenceVerification>()
];
