
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { CollectionInputDto } from '../../dto/Collection.input.dto';
import { CollectionService } from '../../services/collection.service';
import { User, UserService } from '@symbiota2/ui-common';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Institution } from '@symbiota2/api-database';
import { InstitutionService } from '../../services/institution.service';
import { MatDialog } from '@angular/material/dialog';
import { InstitutionNewDialogComponent } from '../institution-new-dialog/institution-new-dialog.component';
import { Router } from '@angular/router';
import { ROUTE_COLLECTION_PROFILE } from '../../routes';
import { CollectionAsyncValidators } from './validators';
import { ApiCollectionCategoryOutput } from '@symbiota2/data-access';
import { ViewportScroller } from '@angular/common';


//TODO: add back end support for additional fields
//TODO: add category functionality

@Component({
    selector: 'symbiota2-collection-new-collection',
    templateUrl: './collection-new-collection.component.html',
    styleUrls: ['./collection-new-collection.component.scss'],
})
export class CollectionNewCollectionComponent implements OnInit {
    user: User;
    inst: Institution[];
    categories: ApiCollectionCategoryOutput[];

    newCollectionForm = this.fb.group({
        collectionName: [
            '',
            Validators.required,
            CollectionAsyncValidators.nameTaken(this.collections),
        ],
        code: [
            '',
            Validators.required,
            CollectionAsyncValidators.codeTaken(this.collections),
        ],
        institutionID: ['0', Validators.required],
        description: [''],
        homepage: ['', Validators.required],
        role: [''],
        contact: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        role2: [''],
        contact2:[''],
        email2:['', Validators.email],
        latitude: [
            '0',
            [Validators.required, Validators.min(-90), Validators.max(90)],
        ],
        longitude: [
            '0',
            [Validators.required, Validators.min(-180), Validators.max(180)],
        ],
        category: ['', Validators.required],
        license: ['', Validators.required],
        aggregators: [false],
        icon: [''],
        type: ['', Validators.required],
        management: ['', Validators.required],
    });

    constructor(
        private fb: FormBuilder,
        private collections: CollectionService,
        private users: UserService,
        private institutions: InstitutionService,
        private dialog: MatDialog,
        private rt: Router,
        private viewportScroller: ViewportScroller,
    ) {}

    ngOnInit(): void {
        this.getUser();
        this.getCategories();
        this.getInstitutions();
    }

    onSubmit(): void {
        var newCollection = new CollectionInputDto(
            this.newCollectionForm.value
        );
        if (this.user.isSuperAdmin()) {
            //NOTE: requires user to be super admin to create new collections
            this.collections
                .createNewCollection(newCollection, this.user.token)
                .subscribe((collection) =>
                    this.rt.navigate([
                        '/' +
                            ROUTE_COLLECTION_PROFILE.replace(
                                ':collectionID',
                                collection.id.toString()
                            ),
                    ])
                );
        }
    }

    onAddNewInst(): void {
        const dialog = this.dialog.open(InstitutionNewDialogComponent, {
            width: '100vw',
            disableClose: true,
        });
        dialog.afterClosed().subscribe((inst: Institution) => {
            if (inst !== null) {
                this.inst.push(inst);
                this.newCollectionForm
                    .get('institutionID')
                    .setValue(String(inst.id));
            }
        });
    }

    getCategories(): void {
        this.collections.categories.subscribe(
            (categories) => (this.categories = categories)
        );
    }

    getInstitutions(): void {
        this.institutions
            .getInstitutions()
            .subscribe((institutions) => (this.inst = institutions));
    }

    getUser(): void {
        this.users.currentUser
            .pipe(
                map((user) => {
                    return user;
                })
            )
            .subscribe((user) => (this.user = user));
    }

    onClickScroll(elementId: string): void {
        this.viewportScroller.scrollToAnchor(elementId);
    }

    populate(): void {
        this.newCollectionForm
            .get('collectionName')
            .setValue('Northern Arizona University Pinecone Collection');
        this.newCollectionForm.get('code').setValue('NAUPC');
        this.newCollectionForm.get('institutionID').setValue('3');
        this.newCollectionForm
            .get('description')
            .setValue('we collect pinecones');
        this.newCollectionForm
            .get('homepage')
            .setValue('https://nau.edu.cefns/pinecones');
        this.newCollectionForm.get('contact').setValue('John');
        this.newCollectionForm.get('email').setValue('John@nau.edu');
        this.newCollectionForm.get('latitude').setValue('35.1878');
        this.newCollectionForm.get('longitude').setValue('-111.6528');
        this.newCollectionForm
            .get('license')
            .setValue('https://opensource.org/licenses/MIT');
        this.newCollectionForm.get('aggregators').setValue(true);
        this.newCollectionForm
            .get('icon')
            .setValue(
                'https://www.collinsdictionary.com/images/full/pinecone_112344086.jpg'
            );
        this.newCollectionForm.get('type').setValue('General Observations');
        this.newCollectionForm.get('management').setValue('snapshot');
    }
}
