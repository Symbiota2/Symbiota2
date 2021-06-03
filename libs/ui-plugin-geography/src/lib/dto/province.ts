import {
    ApiStateProvinceCountryOutput,
    ApiStateProvinceListItemOutput, ApiStateProvinceOutput
} from '@symbiota2/data-access';

export class ProvinceCountry implements ApiStateProvinceCountryOutput {
    id: number;
    countryTerm: string;

    constructor(json: ApiStateProvinceCountryOutput) {
        Object.assign(this, json);
    }
}

export class ProvinceListItem implements ApiStateProvinceListItemOutput {
    id: number;
    stateTerm: string;
    country: ProvinceCountry;

    constructor(json: ApiStateProvinceListItemOutput) {
        const { country, ...props } = json;
        Object.assign(this, props);
        this.country = new ProvinceCountry(country);
    }
}

export class Province extends ProvinceListItem implements ApiStateProvinceOutput {
    constructor(json: ApiStateProvinceOutput) {
        super(json);
    }

    acceptedID: number;
    footprintWKT: string;
}
