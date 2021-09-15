import { Component, OnInit } from '@angular/core';
import { AlertService, UserRole, UserService } from '@symbiota2/ui-common';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
    Collection,
    CollectionListItem,
} from '../../dto/Collection.output.dto';
import { CollectionService } from '../../services/collection.service';
import { ApiUserRoleName } from '@symbiota2/data-access';

@Component({
    selector: 'symbiota2-collection-permissions',
    templateUrl: './collection-permissions.component.html',
    styleUrls: ['./collection-permissions.component.scss'],
})
export class CollectionPermissionsComponent implements OnInit {
    admins: UserRole[];
    editors: UserRole[];
    rareSpeciesReaders: UserRole[];

    collection: Collection;

    constructor(
        readonly collections: CollectionService,
        readonly users: UserService,
        readonly alerts: AlertService,
    ) {}

    ngOnInit(): void {
      this.getCollectionRoles().subscribe(roles => {
        roles.forEach(role => {
          switch (role.name) {
            case ApiUserRoleName.COLLECTION_ADMIN:
              this.admins.push(role)              
              break;
          
            default:
              break;
          }
        });
      })
    }

    getCollection(): Observable<Collection> {
        return this.collections.currentCollection.pipe(
            map((collection) => {
                return collection;
            })
        );
    }

    getCollectionRoles(): Observable<UserRole[]> {
        return this.users.currentUser.pipe(
            map((user) => {
                return user.token;
            }),
            switchMap((token) => {
                return this.collections.getCurrentRoles(token);
            })
        );
    }

    onApplyRoles(uid: number, role: string): void {}
}
