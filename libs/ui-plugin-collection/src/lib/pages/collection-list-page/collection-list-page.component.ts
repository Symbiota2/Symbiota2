import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection.service';

@Component({
    selector: 'symbiota2-collection-list-page',
    templateUrl: './collection-list-page.component.html',
    styleUrls: ['./collection-list-page.component.scss']
})
export class CollectionListPage implements OnInit {
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
