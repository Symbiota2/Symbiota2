import { OccurrenceListItem } from './occurrence-list-item';
import { ApiOccurrenceList } from '@symbiota2/data-access';

export class OccurrenceList implements ApiOccurrenceList {
    count: number;
    data: OccurrenceListItem[];

    constructor(list: ApiOccurrenceList) {
        this.count = list.count;
        this.data = list.data.map((o) => new OccurrenceListItem(o));
    }
}
