import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
    AlertService,
    formToQueryParams,
    User,
    UserService,
} from '@symbiota2/ui-common';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { InstitutionService } from '../../services/institution.service';
import { CollectionAsyncValidators } from '../../validators/CollectionValidators';
import { Institution } from '@symbiota2/api-database';
import { ApiCollectionCategoryOutput } from '@symbiota2/data-access';
import { InstitutionNewDialogComponent } from '../institution-new-dialog/institution-new-dialog.component';
import { CollectionInputDto } from '../../dto/Collection.input.dto';
import { CollectionService } from '../../services/collection.service';
import { Collection } from '../../dto/Collection.output.dto';

@Component({
    selector: 'symbiota2-collection-editor',
    templateUrl: './collection-editor.component.html',
    styleUrls: ['./collection-editor.component.scss'],
})
export class CollectionEditorComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();

    inst$: Observable<Institution[]>;
    categories$: Observable<ApiCollectionCategoryOutput[]>;

    editCollectionForm: FormGroup = this.fb.group(
        {
            collectionName: [
                '',
                Validators.required,
                CollectionAsyncValidators.nameTaken(
                    this.collectionService,
                    true
                ),
            ],
            collectionCode: [
                '',
                Validators.required,
                CollectionAsyncValidators.codeTaken(
                    this.collectionService,
                    true
                ),
            ],
            institutionID: ['0', Validators.required],
            fullDescription: [''],
            homePage: ['', Validators.required],
            contact: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            // contact2: [''],
            // email2: ['', Validators.email],
            latitude: [
                '0',
                [Validators.required, Validators.min(-90), Validators.max(90)],
            ],
            longitude: [
                '0',
                [
                    Validators.required,
                    Validators.min(-180),
                    Validators.max(180),
                ],
            ],
            // category: [''],
            rights: ['', Validators.required],
            //aggregators: [false],
            icon: [''],
            type: ['', Validators.required],
            managementType: ['', Validators.required],
        },
    );

    constructor(
        private fb: FormBuilder,
        private readonly collectionService: CollectionService,
        private readonly institutionService: InstitutionService,
        private readonly dialog: MatDialog,
        private readonly alerts: AlertService
    ) {}

    ngOnInit() {
        this.categories$ = this.collectionService.categories;

        this.inst$ = this.institutionService.getInstitutions();

        this.subscriptions.add(
            this.collectionService.currentCollection.subscribe((collection) => {
                this.patchForm(collection);
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onApplyChanges(): void {
        var updatedCollection: Partial<CollectionInputDto> = new CollectionInputDto(
            this.editCollectionForm.value
        );
        this.collectionService
            .updateCurrentCollection(updatedCollection)
            .subscribe();
    }

    patchForm(collection: Collection): void {
        for (let [field, value] of Object.entries(collection)) {
            // get form field for value
            let formField = this.editCollectionForm.get(field);

            // if form field exists and there is data, populate the field.
            if (!!formField && !!value) {
                formField.setValue(value);
            }
        }
        // this.editCollectionForm
        //     .get('collectionName')
        //     .setValue(collection.collectionName);
        // this.editCollectionForm
        //     .get('collectionCode')
        //     .setValue(collection.collectionCode);
        // this.editCollectionForm
        //     .get('institutionID')
        //     .setValue(collection.institution.id);
        // this.editCollectionForm
        //     .get('fullDescription')
        //     .setValue(collection.fullDescription);
        // this.editCollectionForm.get('homePage').setValue(collection.homePage);
        // this.editCollectionForm.get('contact').setValue(collection.contact);
        // this.editCollectionForm.get('email').setValue(collection.email);
        // this.editCollectionForm
        //     .get('latitude')
        //     .setValue(collection.latitude.toString());
        // this.editCollectionForm
        //     .get('longitude')
        //     .setValue(collection.longitude.toString());
        // this.editCollectionForm.get('rights').setValue(collection.rights);
        // this.editCollectionForm.get('icon').setValue(collection.icon);
        // this.editCollectionForm.get('type').setValue(collection.type);
        // this.editCollectionForm
        //     .get('managementType')
        //     .setValue(collection.managementType);
    }

    onAddNewInst(): void {
        const dialog = this.dialog.open(InstitutionNewDialogComponent, {
            width: '100vw',
            disableClose: true,
        });
        dialog.afterClosed().subscribe((inst: Institution) => {
            if (inst !== null) {
                this.inst$ = this.institutionService.getInstitutions();
                this.editCollectionForm
                    .get('institutionID')
                    .setValue(String(inst.id));
            }
        });
    }
}
