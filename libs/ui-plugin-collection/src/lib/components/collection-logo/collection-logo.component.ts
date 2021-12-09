import { Component, Input, OnInit } from '@angular/core';
import { Collection, CollectionService } from '@symbiota2/ui-plugin-collection';
import { ROUTE_COLLECTION_PROFILE } from '../../routes';

@Component({
    selector: 'symbiota2-collection-logo',
    templateUrl: './collection-logo.component.html',
    styleUrls: ['./collection-logo.component.scss']
})
export class CollectionLogoComponent implements OnInit{

    @Input() collectionID = -1;
    @Input() src = "";
    @Input() size = "2.5rem";

    readonly ROUTE_COLLECTION_PROFILE = ROUTE_COLLECTION_PROFILE;

    constructor(private readonly collectionService: CollectionService){
    }

    ngOnInit(): void {
        if(this.src === "" && this.collectionID > 0){
            this.collectionService.getCollection(this.collectionID).subscribe(collection => {
                this.src = collection.icon;
            })
        }
    }

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
