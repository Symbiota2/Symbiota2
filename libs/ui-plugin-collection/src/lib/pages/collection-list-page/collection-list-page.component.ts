import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { ROUTE_COLLECTION_NEW } from '../../routes'

@Component({
    selector: 'symbiota2-collection-list-page',
    templateUrl: './collection-list-page.component.html',
    styleUrls: ['./collection-list-page.component.scss']
})
export class CollectionListPage implements OnInit {
    readonly ROUTE_COLLECTION_NEW = ROUTE_COLLECTION_NEW;

    expandAll = true;
    categories = this.collectionService.categories;

    constructor(private readonly collectionService: CollectionService) { }

    ngOnInit() {
        this.collectionService.refreshCategories();
    }

    onExpandCollapse(isExpanded: boolean) {
        this.expandAll = isExpanded;
    }
}
