import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Institution } from '@symbiota2/api-database';

@Component({
    selector: 'symbiota2-institution-new-dialog',
    templateUrl: './institution-new-dialog.component.html',
    styleUrls: ['./institution-new-dialog.component.scss'],
})
export class InstitutionNewDialogComponent implements OnInit {

    inst: Institution;

    constructor(
        private readonly dialogRef: MatDialogRef<InstitutionNewDialogComponent>
    ) {}

    ngOnInit(): void {}

    onSubmit($event) {
        this.inst = $event;
        this.dialogRef.close(this.inst);
    }

    onClose() {
        this.dialogRef.close(null);
    }
}
