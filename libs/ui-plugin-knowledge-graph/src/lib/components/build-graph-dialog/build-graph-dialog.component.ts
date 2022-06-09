import { Component, Inject, Input, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'symbiota2-build-graph-dialog-box',
    templateUrl: 'build-graph-dialog.component.html',
    styleUrls: ['build-graph-dialog.component.scss']
})

export class BuildGraphDialogComponent {
    name = ""

    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) public data: string,
        public dialogRef: MatDialogRef<BuildGraphDialogComponent>,
        private readonly translate: TranslateService,
        )
    {
        this.name = data
    }

    doAction(){
        this.dialogRef.close({event: "build"})
    }

    closeDialog(){
        this.dialogRef.close({event:'zzzCancel'})
    }

}
