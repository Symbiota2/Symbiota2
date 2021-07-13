import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Collection } from '../../dto/Collection.output.dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
    selector: 'symbiota2-collection-editor',
    templateUrl: './collection-editor.component.html',
    styleUrls: ['./collection-editor.component.scss']
})
export class CollectionEditorComponent implements OnInit {
    @Input()
    collection!: Collection;

    @Output()
    submitClicked = new EventEmitter<void>();

    @Output()
    resetClicked = new EventEmitter<void>();

    constructor() { }

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

    @Output()
    collectionChange = this.form.valueChanges.pipe(
        map(() => {
            return { ...this.collection, ...this.form.value };
        })
    );

    ngOnInit() {
        this.form.patchValue(this.collection);
    }
}
