import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Collection } from '../../dto/Collection.output.dto';
import {
    FormControl,
    FormGroup,
    Validators,
    FormBuilder,
} from '@angular/forms';
import { map } from 'rxjs/operators';
import { AlertService, formToQueryParams, User, UserService } from '@symbiota2/ui-common';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CollectionService } from '@symbiota2/ui-plugin-collection';
import { Router } from '@angular/router';
import { InstitutionService } from '../../services/institution.service';
import { CollectionAsyncValidators } from '../collection-new-collection/validators';
import { Institution } from '@symbiota2/api-database';
import { ApiCollectionCategoryOutput } from '@symbiota2/data-access';
import { InstitutionNewDialogComponent } from '../institution-new-dialog/institution-new-dialog.component';
import { CollectionInputDto } from '../../dto/Collection.input.dto';

@Component({
    selector: 'symbiota2-collection-editor',
    templateUrl: './collection-editor.component.html',
    styleUrls: ['./collection-editor.component.scss'],
})
export class CollectionEditorComponent implements OnInit {
    user: User;
    collection: Collection;
    inst: Institution[];
    categories: ApiCollectionCategoryOutput[];

    editCollectionForm: FormGroup = this.fb.group({
        collectionName: [
            '',
            Validators.required,
            CollectionAsyncValidators.nameTaken(this.collections),
        ],
        collectionCode: [
            '',
            Validators.required,
            CollectionAsyncValidators.codeTaken(this.collections),
        ],
        institutionID: ['0', Validators.required],
        fullDescription: [''],
        homePage: ['', Validators.required],
        //role: [''],
        contact: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        // role2: [''],
        // contact2: [''],
        // email2: ['', Validators.email],
        latitude: [
            '0',
            [Validators.required, Validators.min(-90), Validators.max(90)],
        ],
        longitude: [
            '0',
            [Validators.required, Validators.min(-180), Validators.max(180)],
        ],
        // category: ['', Validators.required],
        rights: ['', Validators.required],
        //aggregators: [false],
        icon: [''],
        type: ['', Validators.required],
        managementType: ['', Validators.required],
    });

    constructor(
        private fb: FormBuilder,
        private readonly collections: CollectionService,
        private readonly users: UserService,
        private readonly institutions: InstitutionService,
        private readonly dialog: MatDialog,
        private readonly rt: Router,
        private readonly alerts: AlertService
    ) {}

    ngOnInit() {
        this.getUser();
        this.getCollection();
        this.getCategories();
        this.getInstitutions();
        this.patchForm();
    }

    onApplyChanges(): void {
        var patchCollection: Partial<CollectionInputDto> = new CollectionInputDto(this.editCollectionForm.value);
        console.log(patchCollection);
        this.collections.updateCurrentCollection(patchCollection);
        this.alerts.showMessage("Changes Applied");
    }

    patchForm(): void {
        this.editCollectionForm
            .get('collectionName')
            .setValue(this.collection.collectionName);
        this.editCollectionForm.get('collectionCode').setValue(this.collection.collectionCode);
        this.editCollectionForm.get('institutionID').setValue(this.collection.institution.id.toString());
        this.editCollectionForm
            .get('fullDescription')
            .setValue(this.collection.fullDescription);
        this.editCollectionForm
            .get('homePage')
            .setValue(this.collection.homePage);
        this.editCollectionForm.get('contact').setValue(this.collection.contact);
        this.editCollectionForm.get('email').setValue(this.collection.email);
        this.editCollectionForm.get('latitude').setValue(this.collection.latitude.toString());
        this.editCollectionForm.get('longitude').setValue(this.collection.longitude.toString());
        this.editCollectionForm
            .get('rights')
            .setValue(this.collection.rights);
        this.editCollectionForm
            .get('icon')
            .setValue(
                this.collection.icon
            );
        this.editCollectionForm.get('type').setValue(this.collection.type);
        this.editCollectionForm.get('managementType').setValue(this.collection.managementType);
        
    }

    onAddNewInst(): void {
        const dialog = this.dialog.open(InstitutionNewDialogComponent, {
            width: '100vw',
            disableClose: true,
        });
        dialog.afterClosed().subscribe((inst: Institution) => {
            if (inst !== null) {
                this.inst.push(inst);
                this.editCollectionForm
                    .get('institutionID')
                    .setValue(String(inst.id));
            }
        });
    }

    private getCollection(): void {
        this.collections.currentCollection
            .pipe()
            .subscribe((col) => (this.collection = col));
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
}
