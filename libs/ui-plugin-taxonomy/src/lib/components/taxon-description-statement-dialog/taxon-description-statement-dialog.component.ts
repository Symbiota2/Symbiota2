import { Component, Inject, Optional } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { StatementInfo } from '../taxon-description-editor/taxon-description-editor.component'

@Component({
    selector: 'taxon-description-statement-dialog-box',
    templateUrl: './taxon-description-statement-dialog.component.html',
    styleUrls: ['./taxon-description-statement-dialog.component.scss']
})
export class TaxonDescriptionStatementDialogComponent {

    public action : string
    public local_data : any
    public element

    constructor(
        public dialogRef: MatDialogRef<TaxonDescriptionStatementDialogComponent>,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: StatementInfo) {
        this.local_data = {...data}
        this.action = this.local_data.action
    }

    doAction(){
        this.dialogRef.close({event:this.action,data:this.local_data})
    }

    closeDialog(){
        this.dialogRef.close({event:'Cancel'})
    }

}
