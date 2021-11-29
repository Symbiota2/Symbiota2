import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface DialogData {
    newRecords: number;
    updatedRecords: number;
    nullRecords: number;
}

@Component({
  selector: 'symbiota2-taxonomy-upload-confirm-dialog',
  templateUrl: './taxonomy-confirm-dialog.component.html',
  styleUrls: ['./taxonomy-confirm-dialog.component.scss']
})
export class TaxonomyConfirmDialogComponent {
    constructor(
        private readonly dialogRef: MatDialogRef<TaxonomyConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public readonly data: DialogData) { }

    onConfirm() {
        this.dialogRef.close(true);
    }

    onCancel() {
        this.dialogRef.close(false);
    }
}
