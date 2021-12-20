import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
    TAXA_UPLOAD_PROBLEM_ACCEPTED_NAMES_ROUTE,
    TAXA_UPLOAD_PROBLEM_PARENT_NAMES_ROUTE,
    TAXA_UPLOAD_PROBLEM_RANKS_ROUTE
} from '../../../../routes';

interface DialogData {
    problemScinames: number,
    problemAcceptedNames: number,
    problemParentNames: number,
    problemRanks: number,
    nullSciNames: number,
    nullParentNames: number,
    nullKingdomNames: number,
    nullAcceptedNames: number,
    nullRankNames: number,
    totalRecords: number
}

@Component({
  selector: 'symbiota2-taxonomy-upload-confirm-dialog',
  templateUrl: './taxonomy-confirm-dialog.component.html',
  styleUrls: ['./taxonomy-confirm-dialog.component.scss']
})
export class TaxonomyConfirmDialogComponent {
    problemParentRoute = TAXA_UPLOAD_PROBLEM_PARENT_NAMES_ROUTE
    problemAcceptedRoute = TAXA_UPLOAD_PROBLEM_ACCEPTED_NAMES_ROUTE
    problemRanksRoute = TAXA_UPLOAD_PROBLEM_RANKS_ROUTE

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
