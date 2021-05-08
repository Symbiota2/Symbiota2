import { Component, Input } from '@angular/core';
import { CollectionListItem } from '../../dto/Collection.output.dto';
import { ROUTE_COLLECTION_PROFILE } from '../../routes';

@Component({
    selector: 'symbiota2-collection-card',
    templateUrl: './collection-card.component.html',
    styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent {
    readonly ROUTE_COLLECTION_PROFILE = ROUTE_COLLECTION_PROFILE;

    @Input() collection: CollectionListItem;
}
