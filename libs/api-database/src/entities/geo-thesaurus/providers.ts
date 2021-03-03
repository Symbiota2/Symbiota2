
import { GeoThesaurusContinent } from './GeoThesaurusContinent.entity';
import { GeoThesaurusCountry } from './GeoThesaurusCountry.entity';
import { GeoThesaurusCounty } from './GeoThesaurusCounty.entity';
import { GeoThesaurusMunicipality } from './GeoThesaurusMunicipality.entity';
import { GeoThesuarusStateProvince } from './GeoThesuarusStateProvince.entity'
        
export const providers = [
    GeoThesaurusContinent.getProvider<GeoThesaurusContinent>(),
    GeoThesaurusCountry.getProvider<GeoThesaurusCountry>(),
    GeoThesaurusCounty.getProvider<GeoThesaurusCounty>(),
    GeoThesaurusMunicipality.getProvider<GeoThesaurusMunicipality>(),
    GeoThesuarusStateProvince.getProvider<GeoThesuarusStateProvince>()
];
