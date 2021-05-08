import { Component, Input } from '@angular/core';
import { ROUTE_COLLECTION_PROFILE } from '../../routes';

@Component({
    selector: 'symbiota2-collection-logo',
    templateUrl: './collection-logo.component.html',
    styleUrls: ['./collection-logo.component.scss']
})
export class CollectionLogoComponent {
    @Input() collectionID = -1;
    @Input() src = "";
    @Input() size = "2.5rem";

    readonly ROUTE_COLLECTION_PROFILE = ROUTE_COLLECTION_PROFILE;

    get url(): string {
        if (this.collectionID === -1) {
            return '#';
        }
        return `/${ROUTE_COLLECTION_PROFILE}`.replace(
            ":collectionID",
            this.collectionID.toString()
        );
    }
}
