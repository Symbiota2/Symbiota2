import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { UserService } from '@symbiota2/ui-common';
import { switchMap, tap } from 'rxjs/operators';
import {
    Collection,
    CollectionListItem
} from '../../dto/Collection.output.dto';
import { Observable } from 'rxjs';

@Component({
    selector: 'symbiota2-user-profile-collection-tab',
    templateUrl: "./user-profile-collection-tab.component.html"
})
export class UserProfileCollectionTab implements OnInit {
    collections: Observable<CollectionListItem[]>;

    constructor(
        private readonly user: UserService,
        private readonly collectionService: CollectionService) { }

    ngOnInit() {
        this.collections = this.user.currentUser.pipe(
            tap((user) => {
                if (user.isSuperAdmin()) {
                    this.collectionService.setCollectionQueryParams();
                }
                else {
                    this.collectionService.setCollectionQueryParams({
                        id: user.collectionRoles.map((r) => r.tablePrimaryKey)
                    });
                }
            }),
            switchMap(() => {
                return this.collectionService.collectionList;
            })
        );
    }
}
