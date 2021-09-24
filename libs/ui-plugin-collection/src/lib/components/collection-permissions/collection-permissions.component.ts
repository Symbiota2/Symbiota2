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
import { CollectionRoleInput, CollectionRoleOutput } from '../../dto/CollectionRole.dto';
import { CollectionRoleAsyncValidators } from './validators';
import { textChangeRangeIsUnchanged } from 'typescript';

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
    }, CollectionRoleAsyncValidators.userHasRole(this.collections));

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
        return this.collections.getCurrentRoles();
    }

    onUserSelect(user: UserOutputDto) {
        this.newPermissionForm.get("user").setValue(user.uid)

        console.log("onUserSelect uid: ", this.newPermissionForm.get("user").value)
    }

    onApplyRoles(): void {
        //TODO: add pop up to confirm role
        //TODO: check if user has role in collection and add pop up to confirm role change
        const uid: number = this.newPermissionForm.get('user').value;
        console.log("onApplyRoles uid: ", uid);
        
        const role: ApiUserRoleName = this.newPermissionForm.get('role').value;
        console.log("onApplyRoles role: ", role);
        
        const collectionRoleInput = new CollectionRoleInput(uid, role);

        this.collections.postCollectionRole(collectionRoleInput).subscribe();
        this.updateRoles();

    }

    onRemoveRole(role: CollectionRoleOutput): void {
        //TODO: add popup dialog 
        const collectionRoleInput = new CollectionRoleInput(role.user.uid, role.name)
        this.collections.deleteCollectionRole(collectionRoleInput).subscribe();
        this.updateRoles();
    }

    public get apiUserRoleName(): typeof ApiUserRoleName {
        return ApiUserRoleName; 
      }
}
