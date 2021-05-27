import {
    ApiContinentListItemOutput,
    ApiContinentOutput
} from '@symbiota2/api-plugin-geography';

export class ContinentListItem implements ApiContinentListItemOutput {
    id: number;
    acceptedID: number;
    continentTerm: string;

    constructor(json: Record<string, unknown>) {
        Object.assign(this, json);
    }
}

export class Continent implements ApiContinentOutput {
    id: number;
    acceptedID: number;
    continentTerm: string;
    footprintWKT: string;

    constructor(json: Record<string, unknown>) {
        Object.assign(this, json);
    }
}
