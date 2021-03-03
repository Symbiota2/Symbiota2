import { Checklist } from './Checklist.entity';
import { ChecklistChild } from './ChecklistChild.entity';
import { ChecklistCoordinatePair } from './ChecklistCoordinatePair.entity';
import { ChecklistProjectLink } from './ChecklistProjectLink.entity';
import { ChecklistTaxonComment } from './ChecklistTaxonComment.entity';
import { ChecklistTaxonLink } from './ChecklistTaxonLink.entity';
import { ChecklistTaxonStatus } from './ChecklistTaxonStatus.entity';
import { DynamicChecklist } from './DynamicChecklist.entity';
import { DynamicChecklistTaxonLink } from './DynamicChecklistTaxonLink.entity'

export const providers = [
    Checklist.getProvider<Checklist>(),
    ChecklistChild.getProvider<ChecklistChild>(),
    ChecklistCoordinatePair.getProvider<ChecklistCoordinatePair>(),
    ChecklistProjectLink.getProvider<ChecklistProjectLink>(),
    ChecklistTaxonComment.getProvider<ChecklistTaxonComment>(),
    ChecklistTaxonLink.getProvider<ChecklistTaxonLink>(),
    ChecklistTaxonStatus.getProvider<ChecklistTaxonStatus>(),
    DynamicChecklist.getProvider<DynamicChecklist>(),
    DynamicChecklistTaxonLink.getProvider<DynamicChecklistTaxonLink>()
];
