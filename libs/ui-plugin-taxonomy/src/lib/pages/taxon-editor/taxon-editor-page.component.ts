import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import {
    TaxonListItem, TaxonomicAuthorityService,
    TaxonomicStatusService,
    TaxonService, TaxonVernacularListItem, TaxonVernacularService
} from '@symbiota2/ui-plugin-taxonomy';
import { TaxonomicEnumTreeService } from '@symbiota2/ui-plugin-taxonomy'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { TranslateService } from '@ngx-translate/core'
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TaxonEditorDialogComponent } from '../../components';

/**
 * Information about a common name
 */
interface CommonInfo {
    name: string
    notes: string
    source: string
    language: string
    sortSequence: number
}

const ELEMENT_DATA: CommonInfo[] = [
    { name: 'Hydrogen Hydrogen Hydrogen', language: "English", sortSequence: 1, notes: 'H', source: "Yes" },
    { name: 'Hhkhjk', language: "English", sortSequence: 1, notes: 'H', source: "Yes" },
];

@Component({
    selector: 'taxon-editor',
    templateUrl: './taxon-editor-page.html',
    styleUrls: ['./taxon-editor-page.component.scss'],
})

export class TaxonEditorPageComponent implements OnInit {
    displayedColumns = ['name', 'language', 'notes', 'sortSequence', 'source', 'action']

    data: TaxonVernacularListItem[] = []
    dataSource = new MatTableDataSource(this.data)
    private taxonID: string
    languageList = []
    common: CommonInfo

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
                //console.log("s is " + itemList.length)
                //console.log("name is " + itemList[0].vernacularName)

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
        this.data.push(new TaxonVernacularListItem())
        const temp = this.data
        this.data = []
        this.data = temp
        console.log(" new data " + this.data.length)
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

    addRowData(row_obj) {
        /*
        var d = new Date();
        this.dataSource.push({
            id:d.getTime(),
            name:row_obj.name
        });
        this.table.renderRows();
        */
    }

    updateRowData(row_obj) {
        /*
        this.dataSource = this.dataSource.filter((value,key)=>{
            if(value.id == row_obj.id){
                value.name = row_obj.name;
            }
            return true;
        });

         */
    }

    deleteRowData(row_obj) {
        /*
        this.dataSource = this.dataSource.filter((value,key)=>{
            return value.id != row_obj.id;
        });
         */
    }

}
