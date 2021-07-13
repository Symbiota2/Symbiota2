import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Collection } from '@symbiota2/ui-plugin-collection';

@Component({
    selector: 'symbiota2-collection-editor-dialog',
    templateUrl: './collection-editor-dialog.component.html',
    styleUrls: ['./collection-editor-dialog.component.scss']
})
export class CollectionEditorDialogComponent implements OnInit {
    collection: Collection;

    constructor(
        @Inject(MAT_DIALOG_DATA) public readonly collectionInput: Collection,
        private readonly dialogRef: MatDialogRef<CollectionEditorDialogComponent>) { }

    ngOnInit() {
        // Copy the input, then we'll sync the state of the copy with the
        // CollectionEditor form
        this.onReset();
    }

    onSubmit() {
        this.dialogRef.close(this.collection);
    }

    onReset() {
        this.collection = { ...this.collectionInput };
    }

    onClose() {
        this.dialogRef.close(null);
    }
}
