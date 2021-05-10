import { ApiOccurrenceListItem } from '@symbiota2/data-access';

export class OccurrenceListItem implements ApiOccurrenceListItem {
    id: number;
    catalogNumber: string;
    collectionID: number;
    taxonID: number;
    sciname: string;
    latitude: number;
    longitude: number;

    constructor(occurrence: ApiOccurrenceListItem) {
        Object.assign(this, occurrence);
    }
}
