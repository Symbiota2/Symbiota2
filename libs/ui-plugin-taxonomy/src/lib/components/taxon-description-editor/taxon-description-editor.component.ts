import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonDescriptionBlockListItem, TaxonDescriptionBlockService,
    TaxonListItem, TaxonomicAuthorityService,
    TaxonomicStatusService,
    TaxonService, TaxonVernacularListItem, TaxonVernacularService,
    TaxonomicEnumTreeService, TaxonDescriptionDialogComponent
} from '@symbiota2/ui-plugin-taxonomy';
import { TranslateService } from '@ngx-translate/core'
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TaxonEditorDialogComponent } from '../../components';

export interface BlockInfo {
    language: string
    caption: string
    source: string
    sourceUrl: string
    notes: string
    displayLevel: number
}

@Component({
    selector: 'taxon-description-editor',
    templateUrl: './taxon-description-editor.html',
    styleUrls: ['./taxon-description-editor.component.scss'],
})

export class TaxonDescriptionEditorComponent implements OnInit {
    blocks: TaxonDescriptionBlockListItem[] = []
    dataSource = this.blocks
    private taxonID: string
    private idCounter = 0

    constructor(
        //private readonly userService: UserService,  // TODO: needed for species hiding
        private readonly taxonBlockService: TaxonDescriptionBlockService,
        //private readonly taxaService: TaxonService,
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
            // Load the authorities
            this.loadBlocks(parseInt(this.taxonID))
        })
    }

    /*
    Load the taxon description blocks
    */
    loadBlocks(taxonID: number) {

        this.taxonBlockService.findBlocksByTaxonID(taxonID)
            .subscribe((itemList) => {
                this.blocks = itemList
                this.dataSource = this.blocks
                itemList.forEach((item) => {
                })
            })
    }

    onAddDescriptionBlock() {
        this.blocks.push(new TaxonDescriptionBlockListItem())
        this.dataSource = this.blocks
    }

    openDialog(action, obj) {
        obj.action = action
        const dialogRef = (action == 'Delete') ?
            this.dialog.open(TaxonDescriptionDialogComponent, {
                width: '100',
                data: obj
            })
            : this.dialog.open(TaxonDescriptionDialogComponent, {
                width: '80%',
                data: obj
            })

        dialogRef.afterClosed().subscribe(result => {
            if (result.event == 'Update') {
                this.updateRowData(result.data)
            } else if (result.event == 'Delete') {
                this.deleteRowData(result.data)
            }
        })
    }

    updateRowData(row_obj) {
        this.blocks = this.blocks.filter((value,key)=>{
            if(value.id == row_obj.id){
                // copy temporary info to display info
                value.language = row_obj.language
                value.caption = row_obj.caption
                value.source = row_obj.source
                value.sourceUrl = row_obj.sourceUrl
                value.notes = row_obj.notes
                value.displayLevel = row_obj.displayLevel
            }
            return true
        })
    }

    deleteRowData(row_obj) {
        console.log("made it here")
        this.blocks = this.blocks.filter((value,key)=>{
            return value.id != row_obj.id
        })
        this.dataSource = this.blocks
    }

}
