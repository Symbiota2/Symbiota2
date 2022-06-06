import { Component, Inject, Input, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'symbiota2-delete-graph-dialog-box',
    templateUrl: 'delete-graph-dialog.component.html',
    styleUrls: ['delete-graph-dialog.component.scss']
})

export class DeleteGraphDialogComponent {
    name = ""

    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) public data: string,
        public dialogRef: MatDialogRef<DeleteGraphDialogComponent>
        )
    {
        this.name = data
    }

    doAction(){
        //this.dialogRef.close({event:document.getElementById("action")})
        this.dialogRef.close({event: "delete"})
    }

    closeDialog(){
        this.dialogRef.close({event:'zzzCancel'})
    }

}
