import { Component, Input, OnInit } from '@angular/core';
import { DEFAULT_BREAKPOINTS } from '@angular/flex-layout';
import { ROUTE_COLLECTION_PROFILE } from '../../routes';
import { CollectionService } from '../../services/collection/collection.service';

@Component({
    selector: 'symbiota2-collection-logo',
    templateUrl: './collection-logo.component.html',
    styleUrls: ['./collection-logo.component.scss']
})
export class CollectionLogoComponent implements OnInit{

    readonly ROUTE_COLLECTION_PROFILE = ROUTE_COLLECTION_PROFILE;

    readonly DEFAULT_ICON_PATH = "assets/images/default_av.png"

    @Input() collectionID = -1;
    @Input() src = "";
    @Input() size = "2.5rem";


    constructor(private readonly collectionService: CollectionService){
    }

    ngOnInit(): void {
        if(this.src == "" && this.collectionID > 0){
            this.collectionService.getCollection(this.collectionID).subscribe(collection => {
                if(!! collection.icon)
                {
                    this.src = collection.icon;
                } else {
                    this.src = this.DEFAULT_ICON_PATH;
                }
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
