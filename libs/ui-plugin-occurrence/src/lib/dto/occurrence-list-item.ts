import { ApiOccurrenceListItem } from '@symbiota2/data-access';
import { CollectionListItem } from '@symbiota2/ui-plugin-collection';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class OccurrenceListItem implements ApiOccurrenceListItem {
    @Expose() id: number;
    @Expose() catalogNumber: string;
    @Expose() taxonID: number;
    @Expose() scientificName: string;
    @Expose() latitude: number;
    @Expose() longitude: number;

    @Expose()
    @Type(() => CollectionListItem)
    collection: CollectionListItem;

    constructor(occurrence: ApiOccurrenceListItem) {
        Object.assign(this, occurrence);
    }
}
