import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonDescriptionBlockInputDto,
    TaxonListItem,
    TaxonService,
    TaxonTaxonDialogComponent
} from '@symbiota2/ui-plugin-taxonomy';
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { filter } from 'rxjs/operators';
import { TaxonInputDto } from '../../dto/taxonInputDto';

export interface TaxonInfo {
    kingdomName: string
    rankID: number | null
    scientificName: string
    unitName1: string
    unitName2: string
    unitName3: string
    author: string
    phyloSortSequence: number | null
    status: string
    source: string
    notes: string
    hybrid: string
    securityStatus: number
}

@Component({
    selector: 'taxon-taxon-editor',
    templateUrl: './taxon-taxon-editor.html',
    styleUrls: ['./taxon-taxon-editor.component.scss'],
})

export class TaxonTaxonEditorComponent implements OnInit {
    taxon: TaxonListItem
    dataSource
    private taxonID: string
    private idCounter = 0
    userID : number = null
    userCanEdit: boolean = false

    constructor(
        private readonly userService: UserService,
        //private readonly taxonBlockService: TaxonDescriptionBlockService,
        private readonly taxaService: TaxonService,
        //private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        //private readonly taxonomicStatusService: TaxonomicStatusService,
        //private readonly taxonVernacularService: TaxonVernacularService,
        //private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
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
            // Load the taxon
            this.loadTaxon(parseInt(this.taxonID))
        })

        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditTaxon(user.uid)
            })
    }

    /*
    Load the taxon description blocks
    */
    loadTaxon(taxonID: number) {
        this.taxaService.findByID(taxonID)
            .subscribe((item) => {
                this.taxon = item
                this.dataSource = this.taxon
            })
    }

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
                this.updateData(result.data)
            }
        })
    }

    updateData(obj) {
        // Copy data to current state
        this.taxon.scientificName = obj.scientificName
        this.taxon.unitName1 = obj.unitName1
        this.taxon.unitName2 = obj.unitName2
        this.taxon.unitName3 = obj.unitName3
        this.taxon.kingdomName = obj.kingdomName
        this.taxon.rankID = obj.rankID
        this.taxon.author = obj.author
        this.taxon.phyloSortSequence = obj.phyloSortSequence
        this.taxon.status = obj.status
        this.taxon.source = obj.source
        this.taxon.notes = obj.notes
        this.taxon.hybrid = obj.hybrid
        this.taxon.securityStatus = obj.securityStatus
        // Construct a new taxon
        const data = {
            id: this.taxonID,
            scientificName: obj.scientificName,
            unitName1: obj.unitName1,
            unitName2: obj.unitName2,
            unitName3: obj.unitName3,
            kingdomName: obj.kingdomName,
            rankID: obj.rankID,
            author: obj.author,
            phyloSortSequence: obj.phyloSortSequence,
            status: obj.status,
            source: obj.source,
            notes: obj.notes,
            hybrid: obj.hybrid,
            securityStatus: obj.securityStatus,
            initialTimestamp: new Date()
        }
        const newTaxon = new TaxonInputDto(data)
        this.taxaService
            .update(new TaxonInputDto(data))
            .subscribe((taxon)=> {
                if (taxon) {
                    // It has been updated in the database
                    this.showMessage("taxon.editor.updated")
                } else {
                    // Error in adding
                    this.showError("taxon.editor.updated.error")
                }
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
