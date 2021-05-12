import { OccurrenceListItem } from './occurrence-list-item';
import { ApiOccurrenceList } from '@symbiota2/data-access';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OccurrenceList implements ApiOccurrenceList {
    @Expose()
    count: number;

    @Expose()
    data: OccurrenceListItem[];

    constructor(list: ApiOccurrenceList) {
        this.count = list.count;
        this.data = list.data.map((o) => new OccurrenceListItem(o));
    }
}
