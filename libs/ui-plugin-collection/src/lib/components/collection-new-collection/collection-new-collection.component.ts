import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { CollectionInputDto } from '../../dto/Collection.input.dto';
import { CollectionService } from '../../services/collection.service';
import { AlertService } from '@symbiota2/ui-common';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Institution } from '@symbiota2/api-database';
import { InstitutionService } from '../../services/institution.service';
import { MatDialog } from '@angular/material/dialog';
import { InstitutionNewDialogComponent } from '../institution-new-dialog/institution-new-dialog.component';
import { Router } from '@angular/router';
import { ROUTE_COLLECTION_PROFILE } from '../../routes';
import { CollectionAsyncValidators } from '../../validators/CollectionValidators';
import { ApiCollectionCategoryOutput } from '@symbiota2/data-access';
import { ViewportScroller } from '@angular/common';
import { InstitutionAsyncValidators } from '../../validators/InstitutionValidators';
import { format } from 'path';
import { InstitutionInputDto } from '../../dto/Institution.input.dto';
import { icon } from 'leaflet';

//TODO: add back end and db support for additional fields

@Component({
    selector: 'symbiota2-collection-new-collection',
    templateUrl: './create-collection-form.component.html',
    styleUrls: ['./collection-new-collection.component.scss'],
})
export class CollectionNewCollectionComponent implements OnInit {
    inst$: Observable<Institution[]>;
    categories$: Observable<ApiCollectionCategoryOutput[]>;

    instOption: 'create' | 'select' = 'create';

    createCollectionForm = this.fb.group({
        collectionName: [
            '',
            Validators.required,
            CollectionAsyncValidators.nameTaken(this.collectionService),
        ],
        collectionCode: [
            '',
            Validators.required,
            CollectionAsyncValidators.codeTaken(this.collectionService),
        ],
        institutionName: [
            '',
            Validators.required,
            InstitutionAsyncValidators.nameTaken(this.institutionService),
        ],
        institutionCode: [
            '',
            Validators.required,
            InstitutionAsyncValidators.codeTaken(this.institutionService),
        ],
        institutionID: ['', Validators.required],
        fullDescription: [''],
        homePage: [''],
        role: [''],
        contact: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        role2: [''],
        contact2: [''],
        email2: ['', Validators.email],
        latitude: [
            '',
            [Validators.required, Validators.min(-90), Validators.max(90)],
        ],
        longitude: [
            '',
            [Validators.required, Validators.min(-180), Validators.max(180)],
        ],
        categoryID: ['', Validators.required],
        rights: ['', Validators.required],
        aggregators: [true],
        icon: [''],
        type: ['', Validators.required],
        management: ['', Validators.required],
        instOption: ['select'],
    });

    constructor(
        private fb: FormBuilder,
        private collectionService: CollectionService,
        private institutionService: InstitutionService,
        private dialog: MatDialog,
        private alertService: AlertService,
        private rt: Router,
        private viewportScroller: ViewportScroller
    ) {}

    ngOnInit(): void {
        this.categories$ = this.collectionService.categories;
        this.inst$ = this.institutionService.getInstitutions();

        // listen to instOption to toggle inst select/create disabled status
        this.createCollectionForm
            .get('instOption')
            .valueChanges.subscribe((option) => this.onToggleInst(option));
        // setting default toggle to select institution
        this.onToggleInst('select');
    }

    onSubmit(): void {
        //create collection input dto from valid fields in form

        var newCollection = new CollectionInputDto(
            this.createCollectionForm.value
        );

        //get inst option to choose to create a new institution or not
        var instOptionValue = this.createCollectionForm.get('instOption').value;

        // name and code of to be created institution from form
        var iName = this.createCollectionForm.get('institutionName').value;
        var iCode = this.createCollectionForm.get('institutionCode').value;

        //create institution if option selected then create collection
        if (instOptionValue === 'create') {
            this.institutionService
                .createInstitution(
                    new InstitutionInputDto({ name: iName, code: iCode })
                )
                .pipe(tap((inst) => (newCollection.institutionID = inst.id)))
                .subscribe((_) => this.createCollection(newCollection));
        } else if (instOptionValue === 'select') { // if not just create collection
            this.createCollection(newCollection);
        }
    }

    private createCollection(newCollection: CollectionInputDto) {
        this.collectionService
            .createNewCollection(newCollection)
            .subscribe((collection) => {
                if (!!collection) {
                    this.alertService.showMessage('New Collection Created');
                    this.rt.navigate([
                        '/' +
                            ROUTE_COLLECTION_PROFILE.replace(
                                ':collectionID',
                                collection.id.toString()
                            ),
                    ]);
                } else {
                    this.alertService.showError(
                        'Error: something went wrong creating your collection.'
                    );
                }
            });
    }

    onClickScroll(elementId: string): void {
        this.viewportScroller.scrollToAnchor(elementId);
    }

    onToggleInst(option: 'select' | 'create') {
        if (option === 'select') {
            this.createCollectionForm.get('institutionName').disable();
            this.createCollectionForm.get('institutionCode').disable();
            this.createCollectionForm.get('institutionID').enable();
        } else if (option === 'create') {
            this.createCollectionForm.get('institutionID').disable();
            this.createCollectionForm.get('institutionName').enable();
            this.createCollectionForm.get('institutionCode').enable();
        }
    }

    populate(): void {
        this.createCollectionForm
            .get('collectionName')
            .setValue('Northern Arizona University Pinecone Collection');
        this.createCollectionForm.get('code').setValue('NAUPC');
        this.createCollectionForm.get('institutionID').setValue('3');
        this.createCollectionForm
            .get('description')
            .setValue('we collect pinecones');
        this.createCollectionForm
            .get('homepage')
            .setValue('https://nau.edu.cefns/pinecones');
        this.createCollectionForm.get('contact').setValue('John');
        this.createCollectionForm.get('email').setValue('John@nau.edu');
        this.createCollectionForm.get('latitude').setValue('35.1878');
        this.createCollectionForm.get('longitude').setValue('-111.6528');
        this.createCollectionForm
            .get('license')
            .setValue('https://opensource.org/licenses/MIT');
        this.createCollectionForm.get('aggregators').setValue(true);
        this.createCollectionForm
            .get('icon')
            .setValue(
                'https://www.collinsdictionary.com/images/full/pinecone_112344086.jpg'
            );
        this.createCollectionForm.get('type').setValue('General Observations');
        this.createCollectionForm.get('management').setValue('snapshot');
    }
}
