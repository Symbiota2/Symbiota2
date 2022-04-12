import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection/collection.service';
import { ROUTE_COLLECTION_NEW } from '../../routes';
import { UserService } from '@symbiota2/ui-common';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'symbiota2-collection-list-page',
    templateUrl: './collection-list-page.component.html',
    styleUrls: ['./collection-list-page.component.scss'],
})
export class CollectionListPage implements OnInit {
    readonly ROUTE_COLLECTION_NEW = ROUTE_COLLECTION_NEW;

    expandAll = true;
    categories = this.collectionService.categories;

    constructor(
        private readonly user: UserService,
        private readonly collectionService: CollectionService
    ) {}

    ngOnInit() {
        this.collectionService.refreshCategories();
    }

    //TODO: this function is made a lot and should just be built into user service
    //TODO: clean function
    isAdmin(): Observable<boolean> {
        var result;

        this.user.currentUser.subscribe(user => {
            result = user !== null && user.isSuperAdmin();
        })
            
        return result;
    }

    onExpandCollapse(isExpanded: boolean) {
        this.expandAll = isExpanded;
    }
}
