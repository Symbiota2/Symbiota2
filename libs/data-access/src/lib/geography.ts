export interface ApiContinentListItemOutput {
    id: number;
    continentTerm: string;
    acceptedID: number;
}

export interface ApiContinentOutput extends ApiContinentListItemOutput {
    footprintWKT: string;
}

export interface ApiCountryListItemOutput {
    id: number;
    continentID: number;
    acceptedID: number;
    countryTerm: string;
}

export interface ApiCountryOutput extends ApiCountryListItemOutput {
    iso: string;
    iso3: string;
    footprintWKT: string;
}