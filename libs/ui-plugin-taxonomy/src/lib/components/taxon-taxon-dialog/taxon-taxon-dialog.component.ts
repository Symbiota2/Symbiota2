import { Component, Inject, Optional } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { TaxonInfo } from '../taxon-taxon-editor/taxon-taxon-editor.component';

@Component({
    selector: 'taxon-taxon-dialog-box',
    templateUrl: './taxon-taxon-dialog.component.html',
    styleUrls: ['./taxon-taxon-dialog.component.scss']
})
export class TaxonTaxonDialogComponent {

    public action : string
    public local_data : any
    public element

    constructor(
        public dialogRef: MatDialogRef<TaxonTaxonDialogComponent>,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: TaxonInfo) {
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
