import { Component, Inject, Optional } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormControl, Validators } from '@angular/forms'
import { TaxonomicUnitService } from '../../../../../ui-plugin-taxonomy/src/lib/services';
import { ImageInfo } from '../../pages/image-details/image-details-page.component';

@Component({
    selector: 'image-details-editor-dialog-box',
    templateUrl: './image-details-editor-dialog.component.html',
    styleUrls: ['./image-details-editor-dialog.component.scss']
})
export class ImageDetailsEditorDialogComponent {

    public action : string
    public local_data
    sortSequence
    constructor(
        public dialogRef: MatDialogRef<ImageDetailsEditorDialogComponent>,
        private readonly taxonomicUnitService: TaxonomicUnitService,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: ImageInfo) {
        this.local_data = {...data}
        this.action = this.local_data.action
        this.sortSequence =
            new FormControl(
                this.local_data.sortSequence,
                [Validators.pattern("[0-9]+")]
            )
    }

    ngOnInit() {

    }

    doAction(){
        //this.local_data.sortSequence = this.sortSequence
        this.dialogRef.close({event:this.action,data:this.local_data})
    }

    closeDialog(){
        this.dialogRef.close({event:'Cancel'})
    }

}
