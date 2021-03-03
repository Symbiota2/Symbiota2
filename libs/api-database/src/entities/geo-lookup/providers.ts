import { LookupCountry } from './LookupCountry.entity';
import { LookupCounty } from './LookupCounty.entity';
import { LookupMunicipality } from './LookupMunicipality.entity';
import { LookupStateProvince } from './LookupStateProvince.entity'

export const providers = [
    LookupCountry.getProvider<LookupCountry>(),
    LookupCounty.getProvider<LookupCounty>(),
    LookupMunicipality.getProvider<LookupMunicipality>(),
    LookupStateProvince.getProvider<LookupStateProvince>()
];
