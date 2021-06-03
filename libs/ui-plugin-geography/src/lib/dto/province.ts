import { ApiCountryListItemOutput, ApiCountryOutput } from '@symbiota2/data-access';

export class ProvinceListItem implements ApiCountryListItemOutput {
    id: number;
    acceptedID: number;
    continentID: number;
    countryTerm: string;

    constructor(json: Record<string, unknown>) {
        Object.assign(this, json);
    }
}

export class Province implements ApiCountryOutput {
    id: number;
    acceptedID: number;
    continentID: number;
    countryTerm: string;
    footprintWKT: string;
    iso: string;
    iso3: string;

    constructor(json: Record<string, unknown>) {
        Object.assign(this, json);
    }
}
