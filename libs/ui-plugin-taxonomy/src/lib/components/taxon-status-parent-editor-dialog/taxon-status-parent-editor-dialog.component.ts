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
    selector: 'taxon-status-parent-editor-dialog',
    templateUrl: './taxon-status-parent-editor-dialog.component.html',
    styleUrls: ['./taxon-status-parent-editor-dialog.component.scss']
})
export class TaxonStatusParentEditorDialogComponent {

    public action : string
    public local_data : any
    public element
    taxonomicAuthorityID
    kindOfName = 'Scientific'
    nameControl = new FormControl()
    nameOptions: TaxonIDAuthorNameItem[] = []
    hasAuthors = true
    taxonID

    constructor(
        private readonly taxaService: TaxonService,
        public dialogRef: MatDialogRef<TaxonStatusParentEditorDialogComponent>,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data
    ) {
        this.local_data = {...data}
        this.action = this.local_data.action
        this.taxonomicAuthorityID = this.local_data.taxonomicAuthorityID
        this.taxonID = this.local_data.taxonID
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
        if (this.kindOfName == 'Scientific') {
            this.loadScientificNames(partialName)
        } else {
            // An error, no common names suppported, should never get here
        }
    }

    doAction(){
        // Need to update the parent
        const sname = this.hasAuthors? this.nameControl.value.split(' -')[0] : this.nameControl.value
        this.dialogRef.close({event:this.action,data:sname})
    }

    closeDialog(){
        this.dialogRef.close({event:'Cancel'})
    }

}
