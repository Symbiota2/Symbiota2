import { Component, Inject, Input, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'symbiota2-download-graph-dialog-box',
    templateUrl: 'download-graph-dialog.component.html',
    styleUrls: ['download-graph-dialog.component.scss']
})

export class DownloadGraphDialogComponent {
    name = ""

    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) public data: string,
        public dialogRef: MatDialogRef<DownloadGraphDialogComponent>
        )
    {
        this.name = data
    }

    doAction(){
        this.dialogRef.close({event: "download"})
    }

    closeDialog(){
        this.dialogRef.close({event:'zzzCancel'})
    }

}
