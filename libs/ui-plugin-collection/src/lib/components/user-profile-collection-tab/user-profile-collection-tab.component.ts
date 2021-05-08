import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { UserService } from '@symbiota2/ui-common';
import { switchMap } from 'rxjs/operators';
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
            switchMap((user) => {
                if (user.isSuperAdmin()) {
                    return this.collectionService.findAll();
                }
                const collectionIDs = user.collectionRoles.map((r) => r.tablePrimaryKey);
                return this.collectionService.findByIDs(collectionIDs);
            })
        );
    }
}
