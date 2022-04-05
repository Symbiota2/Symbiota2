import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { CollectionInputDto } from '../../dto/Collection.input.dto';
import { CollectionService } from '../../services/collection.service';
import { AlertService } from '@symbiota2/ui-common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Institution } from '@symbiota2/api-database';
import { InstitutionService } from '../../services/institution.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ROUTE_COLLECTION_PROFILE } from '../../routes';
import { CollectionAsyncValidators } from '../../validators/CollectionValidators';
import { ApiCollectionCategoryOutput } from '@symbiota2/data-access';
import { ViewportScroller } from '@angular/common';
import { InstitutionAsyncValidators } from '../../validators/InstitutionValidators';
import { InstitutionInputDto } from '../../dto/Institution.input.dto';

//TODO: add back end and db support for additional fields

@Component({
    selector: 'symbiota2-create-collection-form',
    templateUrl: './create-collection-form.component.html',
    styleUrls: ['./create-collection-form.component.scss'],
})
export class CollectionNewCollectionComponent implements OnInit {
    inst$: Observable<Institution[]>;
    categories$: Observable<ApiCollectionCategoryOutput[]>;

    instOption: 'create' | 'select' = 'create';

    createCollectionForm = this.fb.group({
        collectionName: [
            '',
            [Validators.required, Validators.maxLength(150)],
            CollectionAsyncValidators.nameTaken(this.collectionService),
        ],
        collectionCode: [
            '',
            [Validators.required, Validators.maxLength(45)],
            CollectionAsyncValidators.codeTaken(this.collectionService),
        ],
        institutionName: [
            '',
            [Validators.required, Validators.maxLength(150)],
            InstitutionAsyncValidators.nameTaken(this.institutionService),
        ],
        institutionCode: [
            '',
            [Validators.required, Validators.maxLength(45)],
            InstitutionAsyncValidators.codeTaken(this.institutionService),
        ],
        institutionID: ['', Validators.required],
        fullDescription: ['', Validators.maxLength(2000)],
        homePage: ['', Validators.maxLength(250)],
        role: [''],
        contact: ['', [Validators.required, Validators.maxLength(250)],],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(45)]],
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
        icon: ['', Validators.maxLength(250)],
        type: ['', Validators.required, Validators.maxLength(45)],
        management: ['', Validators.required, Validators.maxLength(45)],
        instOption: ['select']
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
                .subscribe(( inst: Institution) => {
                    newCollection.institutionID = inst.id
                    this.createCollection(newCollection);
                })
                    
        } else if (instOptionValue === 'select') { // if not just create collection
            this.createCollection(newCollection);
        }
    }

    private createCollection(newCollection: CollectionInputDto){

        this.collectionService
            .createCollection(newCollection)
            .pipe(
                map((collection) => {
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

                return collection;
            })).subscribe();
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
}
