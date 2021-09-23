import { Component, OnInit } from '@angular/core';
import { AlertService, UserRole, UserService } from '@symbiota2/ui-common';
import { Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import {
    Collection,
    CollectionListItem,
} from '../../dto/Collection.output.dto';
import { CollectionService } from '../../services/collection.service';
import { ApiUserRoleName } from '@symbiota2/data-access';
import { UserOutputDto } from '@symbiota2/api-auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollectionRoleInput, CollectionRoleOutput } from '../../dto/CollectionRole.output.dto';

@Component({
    selector: 'symbiota2-collection-permissions',  
    templateUrl: './collection-permissions.component.html',
    styleUrls: ['./collection-permissions.component.scss'],
})
export class CollectionPermissionsComponent implements OnInit {
    admins: Observable<CollectionRoleOutput[]>;
    editors: Observable<CollectionRoleOutput[]>;
    rareSpeciesReaders: Observable<CollectionRoleOutput[]>;

    collection: Collection;

    userList: Observable<UserOutputDto[]>;

    newPermissionForm: FormGroup = this.fb.group({
        user: [-1, Validators.required],
        role: ['',Validators.required]
    });

    constructor(
        readonly collections: CollectionService,
        readonly users: UserService,
        readonly alerts: AlertService,
        readonly fb: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.updateRoles();

    }

    private updateRoles(): void {
        this.admins = this.getCollectionRoles().pipe(
            map(roles => {
                return roles.filter(role => role.name.includes(ApiUserRoleName.COLLECTION_ADMIN));
            })
        )
        
        this.editors = this.getCollectionRoles().pipe(
            map(roles => {
                return roles.filter(role => role.name.includes(ApiUserRoleName.COLLECTION_EDITOR));
            })
        )
        
        this.rareSpeciesReaders = this.getCollectionRoles().pipe(
            map(roles => {
                return roles.filter(role => role.name.includes(ApiUserRoleName.RARE_SPECIES_READER));
            })
        )
    }

    getCollection(): Observable<Collection> {
        return this.collections.currentCollection.pipe(
            map((collection) => {
                return collection;
            }),
        );
    }

    private getCollectionRoles(): Observable<CollectionRoleOutput[]> {
        return this.users.currentUser.pipe(
            map((user) => {
                return user.token;
            }),
            switchMap((token) => {
                return this.collections.getCurrentRoles(token);
            })
        );
    }

    onUserSelect(user: UserOutputDto) {
        this.newPermissionForm.get("user").setValue(user.uid)

        console.log(this.newPermissionForm.get("user").value)
    }

    onApplyRoles(): void {

        const uid: number = this.newPermissionForm.get('user').value;
        console.log(uid);
        
        const role: ApiUserRoleName = this.newPermissionForm.get('role').value;
        console.log(role);
        
        const collectionRoleInput = new CollectionRoleInput(uid, role);

        //TODO: POST
        this.collections.postCollectionRole(collectionRoleInput).subscribe();
        this.updateRoles();

    }

    onRemoveRole(user: string): void {
        //TODO: remove user api
    }

    public get apiUserRoleName(): typeof ApiUserRoleName {
        return ApiUserRoleName; 
      }
}
