import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonDescriptionBlockListItem,
    TaxonDescriptionBlockService,
    TaxonListItem,
    TaxonomicAuthorityService,
    TaxonomicStatusService,
    TaxonService,
    TaxonVernacularListItem,
    TaxonVernacularService,
    TaxonomicEnumTreeService,
    TaxonDescriptionDialogComponent,
    TaxonDescriptionStatementListItem,
    TaxonDescriptionStatementDialogComponent, TaxonTaxonDialogComponent
} from '@symbiota2/ui-plugin-taxonomy';
import { TranslateService } from '@ngx-translate/core'
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TaxonEditorDialogComponent } from '../../components';
import { Expose, Type } from 'class-transformer';
import { TaxonomicStatusOnlyListItem } from '../../dto/taxon-status-only-list-item';

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

    constructor(
        //private readonly userService: UserService,  // TODO: needed for species hiding
        //private readonly taxonBlockService: TaxonDescriptionBlockService,
        private readonly taxaService: TaxonService,
        //private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        //private readonly taxonomicStatusService: TaxonomicStatusService,
        //private readonly taxonVernacularService: TaxonVernacularService,
        //private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
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
            } else if (result.event == 'Delete') {
                this.deleteData(result.data)
            }
        })
    }

    updateData(obj) {
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
    }

    deleteData(obj) {

    }

}
