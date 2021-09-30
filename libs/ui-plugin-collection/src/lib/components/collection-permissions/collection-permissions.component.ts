import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Collection } from '../../dto/Collection.output.dto';
import { CollectionService } from '../../services/collection.service';
import { ApiUserRoleName } from '@symbiota2/data-access';
import { UserOutputDto } from '@symbiota2/api-auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    CollectionRoleInput,
    CollectionRoleOutput,
} from '../../dto/CollectionRole.dto';
import { CollectionRoleAsyncValidators } from './validators';
import { MatDialog } from '@angular/material/dialog';
import { CollectionPermissionsConfirmDialogComponent } from '../collection-permissions-confirm-dialog/collection-permissions-confirm-dialog.component';

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

    newPermissionForm: FormGroup = this.fb.group(
        {
            user: ['', Validators.required],
            userName: ['', Validators.required],
            role: ['', Validators.required],
        },
        {
            asyncValidators: CollectionRoleAsyncValidators.userHasRole(
                this.collections
            ),
        }
    );

    constructor(
        private readonly collections: CollectionService,
        private readonly fb: FormBuilder,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.updateRoles();
    }

    private updateRoles(): void {
        this.admins = this.getCollectionRoles().pipe(
            map((roles) => {
                return roles.filter((role) =>
                    role.name.includes(ApiUserRoleName.COLLECTION_ADMIN)
                );
            })
        );

        this.editors = this.getCollectionRoles().pipe(
            map((roles) => {
                return roles.filter((role) =>
                    role.name.includes(ApiUserRoleName.COLLECTION_EDITOR)
                );
            })
        );

        this.rareSpeciesReaders = this.getCollectionRoles().pipe(
            map((roles) => {
                return roles.filter((role) =>
                    role.name.includes(ApiUserRoleName.RARE_SPECIES_READER)
                );
            })
        );
    }

    getCollection(): Observable<Collection> {
        return this.collections.currentCollection.pipe(
            map((collection) => {
                return collection;
            })
        );
    }

    private getCollectionRoles(): Observable<CollectionRoleOutput[]> {
        return this.collections.getCurrentRoles();
    }

    onUserSelect(user: UserOutputDto) {
        this.newPermissionForm.get('user').setValue(user.uid);
        this.newPermissionForm
            .get('userName')
            .setValue(`${user.username}(${user.lastName},${user.firstName})`);
    }

    onApplyRoles(): void {
        const uid: number = this.newPermissionForm.get('user').value;

        const userName: string = this.newPermissionForm.get('userName').value;

        const role: ApiUserRoleName = this.newPermissionForm.get('role').value;

        var dialogText: string;

        this.collections
            .getUserRole(uid)
            .pipe(
                map((resRole) => {
                    if (!!resRole) {
                        dialogText = `Change ${userName} permission from ${resRole.name} to ${role}?`;

                        this.dialog
                            .open(CollectionPermissionsConfirmDialogComponent, {
                                data: dialogText,
                            })
                            .afterClosed()
                            .subscribe((res: boolean) => {
                                if (res) {
                                    this.collections
                                        .deleteCollectionRole(
                                            resRole.user.uid,
                                            resRole.name
                                        )
                                        .subscribe((_) => {
                                            this.collections
                                                .postCollectionRole(uid, role)
                                                .subscribe((_) =>
                                                    this.updateRoles()
                                                );
                                        });
                                }
                            });
                    } else {
                        dialogText = `Add ${role} permission for ${userName}?`;
                        this.dialog
                            .open(CollectionPermissionsConfirmDialogComponent, {
                                data: dialogText,
                            })
                            .afterClosed()
                            .subscribe((res: boolean) => {
                                if (res) {
                                    this.collections
                                        .postCollectionRole(uid, role)
                                        .subscribe((_) => this.updateRoles());
                                }
                            });
                    }
                })
            )
            .subscribe();
    }

    onRemoveRole(role: CollectionRoleOutput): void {
        var dialogText: string;
        dialogText = `Remove ${role.name} permission from ${role.user.username}(${role.user.lastName},${role.user.firstName})?`;

        this.dialog
            .open(CollectionPermissionsConfirmDialogComponent, {
                data: dialogText,
            })
            .afterClosed()
            .subscribe((res: boolean) => {
                if (res) {
                    this.collections
                        .deleteCollectionRole(role.user.uid, role.name)
                        .subscribe((res) => {
                            this.updateRoles();
                        });
                }
            });
    }

    public get apiUserRoleName(): typeof ApiUserRoleName {
        return ApiUserRoleName;
    }
}
