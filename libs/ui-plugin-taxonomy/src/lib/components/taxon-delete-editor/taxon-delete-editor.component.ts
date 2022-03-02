import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonomicEnumTreeService, TaxonomicStatusService,
    TaxonomicUnitService,
    TaxonService
} from '../../services';
import {
    TaxonTaxonDialogComponent,
} from '../../components/taxon-taxon-dialog/taxon-taxon-dialog.component';
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { filter } from 'rxjs/operators';
import { TaxonListItem } from '../../dto/taxon-list-item';
import { TaxonInputDto } from '../../dto/taxonInputDto';
import { TAXON_EDITOR_ROUTE_PREFIX } from '../../routes';

@Component({
    selector: 'taxon-delete-editor',
    templateUrl: './taxon-delete-editor.html',
    styleUrls: ['./taxon-delete-editor.component.scss'],
})

export class TaxonDeleteEditorComponent implements OnInit {
    private taxonID: string
    private taxonomicAuthorityID = 1 // Set by controller
    userID : number = null
    userCanEdit: boolean = false
    children = []
    editorRoute = TAXON_EDITOR_ROUTE_PREFIX

    constructor(
        private readonly userService: UserService,
        //private readonly taxonBlockService: TaxonDescriptionBlockService,
        private readonly taxaService: TaxonService,
        //private readonly taxonomicUnitService: TaxonomicUnitService,
        private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        private readonly taxonomicStatusService: TaxonomicStatusService,
        //private readonly taxonVernacularService: TaxonVernacularService,
        //private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
        private readonly imageService, ImageService,
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
        this.currentRoute.paramMap.subscribe(params => {
            this.taxonID = params.get('taxonID')
            // Find out if this taxon has any children
            this.taxonomicStatusService.findChildren(+this.taxonID, this.taxonomicAuthorityID).subscribe((children) => {
                this.children = children
                //children.forEach((child) => {
//
                //})
            })
        })

        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditTaxon(user.uid)
            })
    }

    /*
    openDialog(action, obj) {
        obj.action = action
        const dialogRef = (action == 'Delete') ?
            this.dialog.open(TaxonTaxonDialogComponent, {
                width: '100',
                data: obj
            })
            : this.dialog.open(TaxonTaxonDialogComponent, {
                width: '80%',
                data: obj
            })

        dialogRef.afterClosed().subscribe(result => {
            if (result.event == 'Update') {
                this.deleteTaxon()
            }
        })
    }
     */

    deleteTaxon() {
        // Will delete various things in order
        // First delete images
        this.imageService.deleteByTaxonID(this.taxonID).subscribe((result) => {

        })
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
