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
import { UserOutputDto } from '@symbiota2/api-auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'symbiota2-collection-permissions',  
    templateUrl: './collection-permissions.component.html',
    styleUrls: ['./collection-permissions.component.scss'],
})
export class CollectionPermissionsComponent implements OnInit {
    admins: string[] = [];
    editors: string[] = [];
    rareSpeciesReaders: string[] = [];

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
      this.getCollectionRoles().subscribe(roles => {
        roles.forEach(role => {
          switch (role.name) {
            case ApiUserRoleName.COLLECTION_ADMIN:
                this.users.getUserById(role.id).subscribe(user => {
                    //this.admins.push(user.username);
                });
              break;

            case ApiUserRoleName.COLLECTION_EDITOR:
                this.users.getUserById(role.id).subscribe(user => {
                    //this.editors.push(user.username);
                });

            case ApiUserRoleName.RARE_SPECIES_READER:
                this.users.getUserById(role.id).subscribe(user => {
                    //this.rareSpeciesReaders.push(user.username);
                });
          
            default:
              break;
          }

        });

        this.admins = ['evindunn', 'neilcobb'];
        this.editors = ['ccarter'];
        this.rareSpeciesReaders = [];

        this.userList = this.users.getUsers();
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

    onApplyRoles(): void {
        var user: string = this.newPermissionForm.get('user').value
        var role: string = this.newPermissionForm.get('role').value

        //TODO POST
        console.log(user)

        switch (role) {
            case '0':
                    this.admins.push(user);
              break;

            case "1":
                    this.editors.push(user);
                break;

            case "2":
                    this.rareSpeciesReaders.push(user);
                break;
          
            default:
                    this.alerts.showError("Error creating role")
              break;
          }
    }
}
