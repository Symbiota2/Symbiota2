import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonListItem, TaxonomicAuthorityService,
    TaxonomicStatusService,
    TaxonService, TaxonVernacularListItem, TaxonVernacularService
} from '@symbiota2/ui-plugin-taxonomy';
import { TaxonomicEnumTreeService } from '@symbiota2/ui-plugin-taxonomy'
import { TranslateService } from '@ngx-translate/core'
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TaxonEditorDialogComponent } from '../../components';

export interface CommonNameInfo {
    name: string
    notes: string
    source: string
    language: string
    sortSequence: number
}

@Component({
    selector: 'taxon-vernacular-editor',
    templateUrl: './taxon-vernacular-editor.html',
    styleUrls: ['./taxon-vernacular-editor.component.scss'],
})

export class TaxonVernacularEditorComponent implements OnInit {
    displayedColumns = ['name', 'language', 'notes', 'sortSequence', 'source', 'action']
    data: TaxonVernacularListItem[] = []
    dataSource = new MatTableDataSource(this.data)
    private taxonID: string
    languageList = []
    //common: CommonNameInfo
    private idCounter = 0

    constructor(
        //private readonly userService: UserService,  // TODO: needed for species hiding
        private readonly taxaService: TaxonService,
        private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        private readonly taxonomicStatusService: TaxonomicStatusService,
        private readonly taxonVernacularService: TaxonVernacularService,
        private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
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
            this.loadCommonNames(parseInt(this.taxonID))
        })

    }

    /*
    Load the common name information to edit
    */
    loadCommonNames(taxonID: number) {

        this.taxonVernacularService.findByTaxonID(taxonID)
            .subscribe((itemList) => {
                this.data = itemList
                this.dataSource = new MatTableDataSource(this.data)
                itemList.forEach((item) => {
                })
            })
    }

    onSubmit() {

    }

    /*
     Add a row to the common names
     */
    onAddCommonName() {
        const temp = new TaxonVernacularListItem()
        temp.id = this.idCounter-- // Set the ID to a nonexistent value
        this.data.push(new TaxonVernacularListItem())
        this.dataSource = new MatTableDataSource(this.data)
    }

    openDialog(action, obj) {
        obj.action = action
        const dialogRef = (action == 'Delete') ?
            this.dialog.open(TaxonEditorDialogComponent, {
                width: '100',
                data: obj
            })
            : this.dialog.open(TaxonEditorDialogComponent, {
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
        this.data = this.data.filter((value,key)=>{
            if(value.id == row_obj.id){
                // copy temporary info to display info
                value.vernacularName = row_obj.vernacularName
                value.source = row_obj.source
                value.sortSequence = row_obj.sortSequence
                value.notes = row_obj.notes
                value.language = row_obj.language
            }
            return true
        })
    }

    deleteRowData(row_obj) {
        console.log("made it here")
        this.data = this.data.filter((value,key)=>{
            return value.id != row_obj.id
        })
        this.dataSource = new MatTableDataSource(this.data)
    }

}
