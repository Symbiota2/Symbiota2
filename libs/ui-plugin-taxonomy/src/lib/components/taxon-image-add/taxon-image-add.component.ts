import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonDescriptionBlockListItem, TaxonDescriptionBlockService, TaxonInputDto,
    TaxonomicAuthorityService, TaxonomicEnumTreeService,
    TaxonomicStatusService, TaxonomicUnitService,
    TaxonService, TaxonVernacularService
} from '@symbiota2/ui-plugin-taxonomy';
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { TaxonomicStatusInputDto } from '../../dto/taxonomicStatusInputDto';
import { TaxonIDAuthorNameItem } from '../../dto/taxon-id-author-name-item';
import { plainToClass } from 'class-transformer';
import { filter, switchMap, take } from 'rxjs/operators';
import { ImageService } from '@symbiota2/ui-plugin-image';
import { ImageInputDto } from '../../../../../ui-plugin-image/src/lib/dto/ImageInputDto';
import { combineLatest } from 'rxjs';
import { TAXA_UPLOADER_FIELD_MAP_ROUTE } from '../../routes';
import { TaxonomyUploadService } from '../../services/taxonomyUpload/taxonomy-upload.service';

@Component({
    selector: 'taxon-image-add',
    templateUrl: './taxon-image-add.component.html',
    styleUrls: ['./taxon-image-add.component.scss'],
})

export class TaxonImageAddComponent implements OnInit {
    // User stuff
    userID : number = null
    userCanEdit: boolean = true

    // Which taxon am I editing?
    taxonID: string
    // Bound information about the taxon
    taxon
    // The scientific name of the taxon, initially "unknown"
    taxonName = "unknown"

    keepLarge = false

    photographerOptions : string[] = []
    photographerNames : string[] = []
    photographer = null
    photographerForm = new FormControl()

    public local_data : any
    public rankNamesMap = new Map()
    public rankNames = []
    public rankID

    fileInputControl = new FormControl(null)

    // Form control for sort sequence field
    sortSequenceControl : FormControl

    // Form control for required fields
    photographerControl : FormControl

    taxonomicAuthorityList = []
    taxonomicAuthorityID = 1 // Default taxa authority is set in nginit

    constructor(
        private readonly userService: UserService,
        private readonly taxaService: TaxonService,
        private readonly imageService: ImageService,
        private readonly taxonomicUnitService: TaxonomicUnitService,
        private readonly taxonomicStatusService: TaxonomicStatusService,
        // private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        // private readonly taxonVernacularService: TaxonVernacularService,
        private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
        // private readonly taxonDescriptionBlockService: TaxonDescriptionBlockService,
        private readonly upload: TaxonomyUploadService,
        private readonly alertService: AlertService,
        private router: Router,
        private formBuilder: FormBuilder,
        private currentRoute: ActivatedRoute,
        private readonly translate: TranslateService,
        public dialog: MatDialog
    ) {

    }

    /*
    Called when Angular starts
     */
    ngOnInit() {
        // Initialize form validators
        this.local_data = { }
        this.setUpFormControls()

        // Load the authorities
        this.loadAuthorities()

        // Get the photographer names for display in the menu
        this.loadPhotographers()

        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditTaxon(user.uid)
            })
    }

    /*
    Load the taxa authorities
    */
    public loadAuthorities() {
        this.taxonomicAuthorityService.findAll()
            .subscribe((authorities) => {
                this.taxonomicAuthorityList = authorities
                this.taxonomicAuthorityList.sort(function (a, b) {
                    return (a.id > b.id ? 1 : -1)
                })
                this.taxonomicAuthorityList.forEach((authority) => {
                    if (authority.isPrimay) {
                        this.taxonomicAuthorityID = authority.id
                    }
                })
            })
    }

    /*
    Load the photographer names
    */
    public loadPhotographers() {
        this.imageService.findPhotographerNames()
            .subscribe((names) => {
                this.photographerOptions = names
                this.photographerOptions.sort(function (a, b) {
                    return (a > b ? 1 : -1)
                })
            })
    }

    doSave(){
        this.local_data.phyloSortSequence = this.sortSequenceControl.value
        this.local_data.taxonAuthorityID = this.taxonomicAuthorityID
        this.local_data.initialTimestamp = new Date()
        this.local_data.lastModifiedTimestamp = this.local_data.initialTimestamp
        this.local_data.lastModifiedUID = this.userID
        this.local_data.taxonID = this.taxonID

        // Contruct a new image
        const newImage =  plainToClass(ImageInputDto, this.local_data)

        console.log( " input file is " + this.fileInputControl.value)

        return

        this.imageService.create(newImage).subscribe((image)=> {
            if (image) {
                this.showMessage("taxon.create.saved")
            } else {
                // Error in adding
                this.showError("taxon.editor.updated.error")
            }
        })
    }

    setUpFormControls() {
        this.sortSequenceControl =
            new FormControl(
                this.local_data.phyloSortSequence,
                [Validators.pattern("[0-9]+")]
            )
    }

    /*
    onUpload() {
        combineLatest([
            //this.taxonomicAuthorityID,
            this.upload.uploadFile(this.fileInputControl.value).pipe(
                switchMap(() => this.upload.currentUpload)
            )
        ]).pipe(take(1)).subscribe(([beginUploadResponse]) => {
            //]).pipe(take(1)).subscribe(([authorityID, beginUploadResponse]) => {
            if (beginUploadResponse !== null) {
                this.router.navigate(
                    [TAXA_UPLOADER_FIELD_MAP_ROUTE],
                    {
                        queryParams: {
                            //[Q_PARAM_AUTHORITYID]: authorityID,
                            uploadID: beginUploadResponse.id
                        }
                    }
                )
            }
            else {
                this.alertService.showError('Upload failed')
            }
        })
    }

     */

    /*
    doClear() {
        //this.dialogRef.close({event:'Cancel'})
        this.local_data = { }
        this.setUpFormControls()
    }

     */

    /*
    Taxonomic authority has a new value
    */
    authorityChangeAction() {
        // If the authority changes...
    }

    /*
    Internal routine to encapsulate the show error message at the bottom in case something goes awry
    */
    private showError(s) {
        this.translate.get(s).subscribe((r)  => {
            this.alertService.showError(r)
        })
    }

    /*
    Internal routine to encapsulate the show message at the bottom to confirm things actually happened
    */
    private showMessage(s) {
        this.translate.get(s).subscribe((r)  => {
            this.alertService.showMessage(r)
        })
    }

}
