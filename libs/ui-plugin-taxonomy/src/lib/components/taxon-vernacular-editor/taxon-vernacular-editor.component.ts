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
import { AlertService, UserService } from '@symbiota2/ui-common';
import { filter } from 'rxjs/operators';
import { TaxonDescriptionStatementInputDto } from '../../dto/taxonDescriptionStatementInputDto';
import { TaxonVernacularInputDto } from '../../dto/taxonVernacularInputDto';
import { Expose } from 'class-transformer';


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
    userID : number = null
    userCanEdit: boolean = false

    constructor(
        private readonly userService: UserService,
        private readonly taxaService: TaxonService,
        private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        private readonly taxonomicStatusService: TaxonomicStatusService,
        private readonly taxonVernacularService: TaxonVernacularService,
        private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
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

        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditTaxon(user.uid)
            })
    }

    /*
     Add a row to the common names
     */
    onAddCommonName() {
        // Construct a new common name
        const data = {
            taxonID: +this.taxonID,
            vernacularName: "",
            adminLanguageID: +1, //[TODO Set up the default admin language]
            initialTimestamp: new Date()
            //name: string
            //notes: string
            //source: ""str
            //language:
            //sortSequence: 50
        }

        const newName = new TaxonVernacularInputDto(data)
        this.taxonVernacularService.create(newName).subscribe((name)=> {
            if (name) {
                // It has been added to the database, add it to the current data
                this.data.push(name)
                this.dataSource = new MatTableDataSource(this.data)
                this.showMessage("taxon.vernacular.editor.added")
            } else {
                // Error in adding
                this.showError("taxon.vernacular.editor.added.error")
            }

        })
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
                this.updateCommonName(result.data)
            } else if (result.event == 'Delete') {
                this.deleteCommonName(result.data)
            }
        })
    }

    updateCommonName(row_obj) {
        this.data = this.data.filter((value,key)=>{
            if(value.id == row_obj.id){
                // copy temporary info to display info
                value.vernacularName = row_obj.vernacularName
                value.source = row_obj.source
                value.sortSequence = row_obj.sortSequence
                value.notes = row_obj.notes
                value.language = row_obj.language
                // Construct a new name
                const data = {
                    id: value.id,
                    taxonID: value.taxonID,
                    vernacularName: value.vernacularName,
                    notes: value.notes,
                    source: value.source,
                    language: value.language,
                    sortSequence: value.sortSequence,
                    adminLanguageID: value.adminLanguageID,
                    username: value.username,
                    isUpperTerm: value.isUpperTerm,
                    initialTimestamp: value.initialTimestamp
                }

                const newName = new TaxonVernacularInputDto(data)
                this.taxonVernacularService
                    .update(newName)
                    .subscribe((name)=> {
                        if (name) {
                            // It has been updated in the database
                            this.showMessage("taxon.vernacular.editor.updated")
                        } else {
                            // Error in adding
                            this.showError("taxon.vernacular.editor.updated.error")
                        }
                    })
            }
            return true
        })
    }

    deleteCommonName(row_obj) {
        this.data = this.data.filter((value,key)=>{
            if (value.id == row_obj.id) {
                // Found a statement
                this.taxonVernacularService.delete(row_obj.id)
                    .subscribe((result) => {
                        if (result) {
                            // It has been deleted in the database
                            this.showMessage("taxon.vernacular.editor.deleted")
                        } else {
                            // Error in deleting
                            this.showError("taxon.vernacular.editor.deleted.error")
                        }
                    })
            }
            return value.id != row_obj.id
        })
        this.dataSource = new MatTableDataSource(this.data)
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
