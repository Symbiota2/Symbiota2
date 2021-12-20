import { Component, Inject, Optional } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { CommonNameInfo } from '../taxon-vernacular-editor/taxon-vernacular-editor.component'

@Component({
    selector: 'taxon-editor-dialog-box',
    templateUrl: './taxon-editor-dialog.component.html',
    styleUrls: ['./taxon-editor-dialog.component.scss']
})

export class TaxonEditorDialogComponent {

    public action : string
    public local_data : any
    public element

    constructor(
        public dialogRef: MatDialogRef<TaxonEditorDialogComponent>,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: CommonNameInfo) {
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
