import {
    ApiCountryListItemOutput,
    ApiCountryOutput,
    ApiStateProvinceListItemOutput, ApiStateProvinceOutput
} from '@symbiota2/data-access';

export class ProvinceListItem implements ApiStateProvinceListItemOutput {
    id: number;
    countryID: number;
    stateTerm: string;

    constructor(json: ApiStateProvinceListItemOutput) {
        Object.assign(this, json);
    }
}

export class Province extends ProvinceListItem implements ApiStateProvinceOutput {
    constructor(json: ApiStateProvinceOutput) {
        super(json);
    }

    acceptedID: number;
    footprintWKT: string;
}
