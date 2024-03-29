import { Component, Inject, Optional } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { TaxonInfo } from '../taxon-taxon-editor/taxon-taxon-editor.component';
import { FormControl } from '@angular/forms';
import {
    TaxonomicAuthorityService,
    TaxonomicEnumTreeService,
    TaxonomicStatusService, TaxonomicUnitService,
    TaxonService,
    TaxonVernacularService
} from '../../services';
import { TaxonIDAuthorNameItem } from '../../dto/taxon-id-author-name-item';

@Component({
    selector: 'taxon-status-accepted-editor-dialog',
    templateUrl: './taxon-status-accepted-editor-dialog.component.html',
    styleUrls: ['./taxon-status-accepted-editor-dialog.component.scss']
})
export class TaxonStatusAcceptedEditorDialogComponent {

    public action : string
    public local_data : any
    public element
    taxonomicAuthorityID
    nameControl = new FormControl()
    nameOptions: TaxonIDAuthorNameItem[] = []
    hasAuthors = true
    taxonID
    switchAcceptance = true

    constructor(
        private readonly taxaService: TaxonService,
        public dialogRef: MatDialogRef<TaxonStatusAcceptedEditorDialogComponent>,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data
    ) {
        this.local_data = {...data}
        this.action = this.local_data.action
        this.taxonomicAuthorityID = this.local_data.taxonomicAuthorityID
        this.taxonID = this.local_data.taxon
    }

    /*
    Load Scientific names that start with partialName into a list
     */
    public loadScientificNames(partialName) {
        this.nameOptions= []
        this.taxaService.findAllScientificNames(partialName, this.taxonomicAuthorityID)
            .subscribe((names) => {
                this.nameOptions = names
            })
    }

    /*
    Reload the names as a user types
    */
    onKey(event) {
        if (event.target.value) {
            const partialName = event.target.value
            this.loadNames(partialName)
        }
    }

    /*
    Reload the names as needed
     */
    loadNames(partialName) {
        this.loadScientificNames(partialName)
    }

    doAddLinkAction() {
        // Need to update the parent
        const sname =
            this.hasAuthors?
                this.nameControl.value?
                    this.nameControl.value.split(' -')[0]
                    : this.nameControl.value
                : ""
        this.dialogRef.close({event:this.action,data: {action: "link", name: sname}})
    }

    doMakeAcceptedAction() {
        // Make this one accepted
        this.dialogRef.close({event:this.action,data: {action: "make accepted", switch: this.switchAcceptance}})
    }

    closeDialog(){
        this.dialogRef.close({event:'Cancel'})
    }

}
