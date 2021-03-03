import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { UserService } from '@symbiota2/ui-common';
import { switchMap } from 'rxjs/operators';
import { Collection } from '../../dto/Collection.output.dto';

@Component({
    selector: "lib-user-profile-collection-tab",
    templateUrl: "./user-profile-collection-tab.component.html",
    styleUrls: ["./user-profile-collection-tab.component.scss"]
})
export class UserProfileCollectionTab implements OnInit {
    public collections: Collection[] = [];

    constructor(
        private readonly user: UserService,
        private readonly collectionService: CollectionService) { }

    ngOnInit() {
        this.user.currentUser.pipe(
            switchMap((user) => {
                if (user.isSuperAdmin()) {
                    return this.collectionService.findAll();
                }
                const collectionIDs = user.collectionRoles.map((r) => r.target);
                return this.collectionService.findByIDs(collectionIDs);
            })
        ).subscribe((collections) => {
            this.collections = collections;
        });
    }
}
