//dialog-box.component.ts
import { Component, Inject, Optional } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { CommonNameInfo } from '../taxon-vernacular-editor/taxon-vernacular-editor.component';

@Component({
    selector: 'taxon-description-dialog-box',
    templateUrl: './taxon-description-dialog.component.html',
    styleUrls: ['./taxon-description-dialog.component.scss']
})
export class TaxonDescriptionDialogComponent {

    public action : string
    public local_data : any
    public element

    constructor(
        public dialogRef: MatDialogRef<TaxonDescriptionDialogComponent>,
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
