import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonDescriptionBlockService,
    TaxonDescriptionStatementService,
} from '../../services';
import { TaxonDescriptionDialogComponent } from '../../components/taxon-description-dialog/taxon-description-dialog.component';
import { TaxonDescriptionStatementDialogComponent } from '../../components/taxon-description-statement-dialog/taxon-description-statement-dialog.component';
import { TaxonDescriptionBlockListItem } from '../../dto/taxonDescriptionBlock-list-item';
import { TaxonDescriptionBlockInputDto } from '../../dto/taxonDescriptionBlockInputDto';
import { TaxonDescriptionStatementInputDto } from '../../dto/taxonDescriptionStatementInputDto';
import { TranslateService } from '@ngx-translate/core'
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TaxonEditorDialogComponent } from '../../components';
import { Expose } from 'class-transformer';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { filter, map } from 'rxjs/operators';

export interface BlockInfo {
    language: string
    caption: string
    source: string
    sourceUrl: string
    notes: string
    displayLevel: number
}

export interface StatementInfo {
    heading: string
    displayHeader: 1
    statement: string
    sortSequence: number
}

@Component({
    selector: 'taxon-description-editor',
    templateUrl: './taxon-description-editor.html',
    styleUrls: ['./taxon-description-editor.component.scss'],
})

export class TaxonDescriptionEditorComponent implements OnInit {
    private jwtToken = this.userService.currentUser.pipe(map((user) => user.token))
    userID : number = null
    userCanEdit: boolean = false
    blocks: TaxonDescriptionBlockListItem[] = []
    dataSource = this.blocks
    private taxonID: string
    maxDisplayLevel = 0

    constructor(
        private readonly userService: UserService,
        private readonly taxonBlockService: TaxonDescriptionBlockService,
        private readonly taxonDescriptionStatementService: TaxonDescriptionStatementService,
        private readonly alertService: AlertService,
        private router: Router,
        private formBuilder: FormBuilder,
        private currentRoute: ActivatedRoute,
        private readonly translate: TranslateService,
        public dialog: MatDialog ) { }

    /*
    Called when page loads
     */
    ngOnInit() {
        this.currentRoute.paramMap.subscribe(params => {
            this.taxonID = params.get('taxonID')
            // Load the authorities
            this.loadBlocks(parseInt(this.taxonID))
        })

       this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditTaxonProfile(user.uid)
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
                this.blocks.forEach((block) => {
                    this.maxDisplayLevel = block.displayLevel > this.maxDisplayLevel ?
                        block.displayLevel : this.maxDisplayLevel
                })
            })
    }

    onAddDescriptionBlock() {
        // Construct a new block
        this.maxDisplayLevel += 1
        const data = {
            taxonID: +this.taxonID,
            creatorUID: this.userID,
            displayLevel: this.maxDisplayLevel,
            initialTimestamp: new Date()
        }
        const newBlock = new TaxonDescriptionBlockInputDto(data)
        this.taxonBlockService.create(newBlock).subscribe((block)=> {
            if (block) {
                // It has been added to the database, now make it part of the list of blocks
                this.blocks.push(block)
                this.dataSource = this.blocks
                this.showMessage("taxon.description.editor.block.added")
            } else {
                // Error in adding
                this.showError("taxon.description.editor.block.added.error")
            }
        })
    }

    onAddStatement(block: TaxonDescriptionBlockListItem) {
        // Construct a new statement
        const data = {
            descriptionBlockID: block.id,
            sortSequence: 1,
            initialTimestamp: new Date()
        }

        const newStatement = new TaxonDescriptionStatementInputDto(data)
        this.taxonDescriptionStatementService.create(newStatement).subscribe((statement)=> {
            if (statement) {
                // It has been added to the database, now make it part of the list of blocks
                // Initialize list if it does not exist
                if (!block.descriptionStatements) block.descriptionStatements = []
                block.descriptionStatements.unshift(statement)
                this.dataSource = this.blocks
                this.showMessage("taxon.description.editor.statement.added")
            } else {
                // Error in adding
                this.showError("taxon.description.editor.statement.added.error")
            }

        })
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
                this.updateBlockData(result.data)
            } else if (result.event == 'Delete') {
                this.deleteBlockData(result.data)
            }
        })
    }

    openStatementDialog(action, obj) {
        obj.action = action
        const dialogRef = (action == 'Delete') ?
            this.dialog.open(TaxonDescriptionStatementDialogComponent, {
                width: '100',
                data: obj
            })
            : this.dialog.open(TaxonDescriptionStatementDialogComponent, {
                width: '80%',
                data: obj
            })

        dialogRef.afterClosed().subscribe(result => {
            if (result.event == 'Update') {
                this.updateStatementRowData(result.data)
            } else if (result.event == 'Delete') {
                this.deleteStatementRowData(result.data)
            }
        })
    }

    updateStatementRowData(row_obj) {
        this.blocks = this.blocks.filter((value,key) => {
            if(value.id == row_obj.descriptionBlockID) {
                value.descriptionStatements.filter((statement) => {
                    if (statement.id == row_obj.id) {
                        // copy temporary info to display info
                        statement.sortSequence = row_obj.sortSequence
                        statement.heading = row_obj.heading
                        statement.statement = row_obj.statement
                        statement.displayHeader = row_obj.displayHeader

                        // Construct a new statement
                        let a = statement as unknown as Record<PropertyKey, unknown>
                        a.id = row_obj.id
                        a.taxonID = this.taxonID
                        a.creatorUID = this.userID
                        a.initialTimestamp = new Date()
                        const newStatement = new TaxonDescriptionStatementInputDto(a)

                        /*
                        const data = {
                            id: row_obj.id,
                            taxonID: this.taxonID,
                            descriptionBlockID: statement.descriptionBlockID,
                            sortSequence: statement.sortSequence,
                            heading: statement.heading,
                            statement: statement.statement,
                            displayHeader: statement.displayHeader,
                            creatorUID: this.userID,
                            initialTimestamp: new Date()
                        }
                        const newStatement = new TaxonDescriptionStatementInputDto(data)
                         */
                        this.taxonDescriptionStatementService
                            .update(newStatement)
                            .subscribe((statement)=> {
                                if (statement) {
                                    // It has been updated in the database
                                    this.showMessage("taxon.description.editor.statement.updated")
                                } else {
                                    // Error in adding
                                    this.showError("taxon.description.editor.statement.updated.error")
                                }

                        })
                    }
                })
            }
            return true
        })
    }


    deleteStatementRowData(row_obj) {
        this.blocks = this.blocks.filter((value,key) => {
            if(value.id == row_obj.descriptionBlockID) {
                value.descriptionStatements = value.descriptionStatements.filter((statement) => {
                    if (statement.id == row_obj.id) {
                        // Found a statement
                        this.taxonDescriptionStatementService.delete(row_obj.id)
                            .subscribe((result) => {
                                if (result) {
                                    // It has been deleted in the database
                                    this.showMessage("taxon.description.editor.statement.deleted")
                                } else {
                                    // Error in deleting
                                    this.showError("taxon.description.editor.statement.deleted.error")
                                }
                            })
                    }
                    return statement.id != row_obj.id
                })
            }
            return true
        })
        this.dataSource = this.blocks
    }

    updateBlockData(row_obj) {
        this.blocks = this.blocks.filter((value,key)=>{
            if(value.id == row_obj.id){
                // copy temporary info to display info
                value.language = row_obj.language
                value.caption = row_obj.caption
                value.source = row_obj.source
                value.sourceUrl = row_obj.sourceUrl
                value.notes = row_obj.notes
                value.displayLevel = row_obj.displayLevel

                // Construct a new block
                let a = value as unknown as Record<PropertyKey, unknown>
                a.id = row_obj.id
                a.taxonID = this.taxonID
                a.creatorUID = this.userID
                a.initialTimestamp = new Date()
                const newBlock = new TaxonDescriptionBlockInputDto(a)
                /*
                const data = {
                    id: row_obj.id,
                    taxonID: this.taxonID,
                    language: value.language,
                    caption: value.caption,
                    source: value.source,
                    sourceUrl: value.sourceUrl,
                    notes: value.notes,
                    displayLevel: value.displayLevel,
                    creatorUID: this.userID,
                    initialTimestamp: new Date()
                }
                const newBlock = new TaxonDescriptionBlockInputDto(data)
                 */
                this.taxonBlockService
                    .update(newBlock)
                    .subscribe((block)=> {
                        if (block) {
                            // It has been updated in the database
                            this.showMessage("taxon.description.editor.block.updated")
                        } else {
                            // Error in adding
                            this.showError("taxon.description.editor.block.updated.error")
                        }
                })
            }
            return true
        })
    }

    deleteBlockData(row_obj) {
        this.blocks = this.blocks.filter((value,key)=>{
            if (value.id == row_obj.id) {
                // Found a block
                this.taxonBlockService.delete(row_obj.id)
                    .subscribe((block) => {
                        if (block) {
                            // It has been deletedd
                            this.showMessage("taxon.description.editor.block.deleted")
                        } else {
                            // Error in adding
                            this.showError("taxon.description.editor.block.deleted.error")
                        }
                    })
            }
            return value.id != row_obj.id
        })
        this.dataSource = this.blocks
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
