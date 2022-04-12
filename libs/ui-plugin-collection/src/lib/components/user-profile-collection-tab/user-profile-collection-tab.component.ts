import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection/collection.service';
import { UserService } from '@symbiota2/ui-common';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'symbiota2-user-profile-collection-tab',
    templateUrl: "./user-profile-collection-tab.component.html"
})
export class UserProfileCollectionTab implements OnInit {
    collections = this.collectionService.collectionList;

    constructor(
        private readonly user: UserService,
        private readonly collectionService: CollectionService) { }

    ngOnInit() {
        this.user.currentUser.pipe(filter((user) => user !== null)).subscribe((user) => {
            if (user.isSuperAdmin()) {
                this.collectionService.setCollectionQueryParams();
            }
            else {
                this.collectionService.setCollectionQueryParams({
                    id: user.collectionRoles.map((r) => r.tablePrimaryKey)
                });
            }
        });
    }
}
