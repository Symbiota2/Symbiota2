import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { CollectionInputDto } from '../../dto/Collection.input.dto';
import { CollectionService } from '../../services/collection.service';
import { User, UserService } from '@symbiota2/ui-common';
import { map } from 'rxjs/operators';
import { Institution } from '@symbiota2/api-database';
import { InstitutionService } from '../../services/institution.service';
import { MatDialog } from '@angular/material/dialog';
import { InstitutionNewDialogComponent } from '../institution-new-dialog/institution-new-dialog.component';
import { Router } from '@angular/router';
import { ROUTE_COLLECTION_PROFILE } from '../../routes';

@Component({
    selector: 'symbiota2-collection-new-collection',
    templateUrl: './collection-new-collection.component.html',
    styleUrls: ['./collection-new-collection.component.scss'],
})
export class CollectionNewCollectionComponent implements OnInit {
    user: User;
    inst: Institution[];

    newCollectionForm = this.fb.group({
        collectionName: ['', Validators.required],
        code: ['', Validators.required],
        institutionID: ['0', Validators.required],
        description: ['', Validators.required],
        homepage: ['', Validators.required],
        contact: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        latitude: [
            '0',
            [Validators.required, Validators.min(-90), Validators.max(90)],
        ],
        longitude: [
            '0',
            [Validators.required, Validators.min(-180), Validators.max(180)],
        ],
        // category: ['', Validators.required],
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
        private rt: Router
    ) {}

    ngOnInit(): void {
        this.getUser();
        this.getInstitutions();
    }

    onSubmit(): void {
        var newCollection = new CollectionInputDto(
            this.newCollectionForm.value
        );
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

    onAddNewInst(): void {
        this.dialog.open(InstitutionNewDialogComponent, { disableClose: true });
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
