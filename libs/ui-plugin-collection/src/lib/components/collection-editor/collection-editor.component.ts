import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Collection } from '../../dto/Collection.output.dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'lib-collection-editor',
    templateUrl: './collection-editor.component.html',
    styleUrls: ['./collection-editor.component.scss']
})
export class CollectionEditorComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public readonly collection: Collection,
        private readonly dialogRef: MatDialogRef<CollectionEditorComponent>) { }

    controlName = new FormControl('');
    controlCode = new FormControl('');
    controlDesc = new FormControl('');
    controlHomePage = new FormControl('');
    controlUrl = new FormControl('');
    controlContact = new FormControl('');
    controlEmail = new FormControl('');
    controlLat = new FormControl(0.0, [Validators.min(-90), Validators.max(90)]);
    controlLng = new FormControl(0.0, [Validators.min(-180), Validators.max(180)]);
    controlType = new FormControl('');
    controlMgmtType = new FormControl('');
    controlRightsHolder = new FormControl('');
    controlRights = new FormControl('');
    controlUsage = new FormControl('');
    controlAccessRights = new FormControl('');

    form = new FormGroup({
        'collectionName': this.controlName,
        'collectionCode': this.controlCode,
        'fullDescription': this.controlDesc,
        'homePage': this.controlHomePage,
        'individualUrl': this.controlUrl,
        'contact': this.controlContact,
        'email': this.controlEmail,
        'latitude': this.controlLat,
        'longitude': this.controlLng,
        'rightsHolder': this.controlRightsHolder,
        'rights': this.controlRights,
        'usageTerm': this.controlUsage,
        'accessRights': this.controlAccessRights,
    });

    ngOnInit() {
        this.onReset();
    }

    onEditLogo() {

    }

    onSubmit() {
        this.dialogRef.close(this.form.value);
    }

    onReset() {
        this.form.patchValue(this.collection);
    }

    onClose() {
        this.dialogRef.close();
    }
}
