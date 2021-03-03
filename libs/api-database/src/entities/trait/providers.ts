import { Trait } from './Trait.entity';
import { TraitAttribute } from './TraitAttribute.entity';
import { TraitDependency } from './TraitDependency.entity';
import { TraitState } from './TraitState.entity';
import { TraitTaxonLink } from './TraitTaxonLink.entity'

export const providers = [
    Trait.getProvider<Trait>(),
    TraitAttribute.getProvider<TraitAttribute>(),
    TraitDependency.getProvider<TraitDependency>(),
    TraitState.getProvider<TraitState>(),
    TraitTaxonLink.getProvider<TraitTaxonLink>()
];
