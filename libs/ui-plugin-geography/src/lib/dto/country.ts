import {
    ApiContinentListItemOutput,
    ApiContinentOutput, ApiCountryListItemOutput, ApiCountryOutput
} from '@symbiota2/api-plugin-geography';

export class CountryListItem implements ApiCountryListItemOutput {
    id: number;
    acceptedID: number;
    continentID: number;
    countryTerm: string;

    constructor(json: Record<string, unknown>) {
        Object.assign(this, json);
    }
}

export class Country implements ApiCountryOutput {
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
