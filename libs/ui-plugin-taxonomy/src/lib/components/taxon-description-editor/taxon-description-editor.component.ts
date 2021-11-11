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
    TaxonDescriptionStatementDialogComponent,
    TaxonDescriptionBlockInputDto, TaxonDescriptionStatementService
} from '@symbiota2/ui-plugin-taxonomy';
import { TranslateService } from '@ngx-translate/core'
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TaxonEditorDialogComponent } from '../../components';
import { Expose } from 'class-transformer';
import { TaxonDescriptionStatementInputDto } from '../../dto/taxonDescriptionStatementInputDto';
import { UserService } from '@symbiota2/ui-common';
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
    userID : number = 1
    blocks: TaxonDescriptionBlockListItem[] = []
    dataSource = this.blocks
    private taxonID: string

    constructor(
        private readonly userService: UserService,  // TODO: needed for species hiding
        private readonly taxonBlockService: TaxonDescriptionBlockService,
        private readonly taxonDescriptionStatementService: TaxonDescriptionStatementService,
        //private readonly taxaService: TaxonService,
        //private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        //private readonly taxonomicStatusService: TaxonomicStatusService,
        //private readonly taxonVernacularService: TaxonVernacularService,
        //private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
        private router: Router,
        private formBuilder: FormBuilder,

        private currentRoute: ActivatedRoute,
        private readonly translate: TranslateService,
        public dialog: MatDialog ) { }

    /*
    Called when Angular starts
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
            })
        console.log("here " + this.userID)
    }

    /*
    Load the taxon description blocks
    */
    loadBlocks(taxonID: number) {
        this.taxonBlockService.findBlocksByTaxonID(taxonID)
            .subscribe((itemList) => {
                this.blocks = itemList
                this.dataSource = this.blocks
            })
    }

    onAddDescriptionBlock() {
        // Construct a new blcok
        const data = {
            taxonID: +this.taxonID,
            creatorUID: +1, //this.userID,
            initialTimestamp: new Date()
        }
        const newBlock = new TaxonDescriptionBlockInputDto(data)
        //newBlock.taxonID = +this.taxonID
        //newBlock.creatorUID = +this.userID
        this.taxonBlockService.create(newBlock).subscribe((block)=> {
            // It has been added to the database, now make it part of the list of blocks
            this.blocks.push(block)
            this.dataSource = this.blocks
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
            // It has been added to the database, now make it part of the list of blocks
            // Initialize list if it does not exist
            if (!block.descriptionStatements) block.descriptionStatements = []
            block.descriptionStatements.unshift(new TaxonDescriptionStatementListItem())
            this.dataSource = this.blocks
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
                            .subscribe((itemList) => {
                                // Assume deleted [TODO: add error handling ]
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
                this.taxonBlockService.update(new TaxonDescriptionBlockInputDto(data)).subscribe((block)=> {
                    // It has been updated in the database
                    //this.blocks.push(block)
                    //this.dataSource = this.blocks
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
                    .subscribe((itemList) => {
                        // Assume deleted [TODO: add error handling ]
                    })
            }
            return value.id != row_obj.id
        })
        this.dataSource = this.blocks
    }

}
