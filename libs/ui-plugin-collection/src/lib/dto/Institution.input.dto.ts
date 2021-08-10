import { ApiInstitutionInput } from '@symbiota2/data-access';

export class InstitutionInputDto implements ApiInstitutionInput {
    constructor(data: Record<string, unknown>) {
        Object.assign(this, data);
    }

    code: string
    name: string
    address1: string
    address2: string
    city: string
    stateProvince: string
    postalCode: string
    country: string
    phone: string
    contact: string
    email: string
    url: string
    notes: string
}