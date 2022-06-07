import { Component, Inject, Input, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'symbiota2-rebuild-graph-dialog-box',
    templateUrl: 'rebuild-graph-dialog.component.html',
    styleUrls: ['rebuild-graph-dialog.component.scss']
})

export class RebuildGraphDialogComponent {
    name = ""

    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) public data: string,
        public dialogRef: MatDialogRef<RebuildGraphDialogComponent>
        )
    {
        this.name = data
    }

    doAction(){
        this.dialogRef.close({event: "rebuild"})
    }

    closeDialog(){
        this.dialogRef.close({event:'zzzCancel'})
    }

}
