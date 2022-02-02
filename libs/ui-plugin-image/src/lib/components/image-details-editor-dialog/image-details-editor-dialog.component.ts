import { Component, Inject, Optional } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormControl, Validators } from '@angular/forms'
import { ImageInfo } from '../image-details-editor/image-details-editor.component';
import { TaxonomicUnitService } from '../../../../../ui-plugin-taxonomy/src/lib/services';

@Component({
    selector: 'image-details-editor-dialog-box',
    templateUrl: './image-details-editor-dialog.component.html',
    styleUrls: ['./image-details-editor-dialog.component.scss']
})
export class ImageDetailsEditorDialogComponent {

    public action : string
    public local_data
    // public rankNamesMap = new Map()
    // public rankNames = []
    // public rankID
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
        /*
        this.rankNamesMap = new Map()
        this.taxonomicUnitService.findAll().subscribe((ranks) => {
            ranks.forEach((rank) => {
                if (rank.kingdomName == this.local_data.kingdomName) {
                    this.rankNamesMap.set(rank.rankID, {name: rank.rankName, id: rank.rankID})
                }
                if (rank.rankID = this.local_data.rankID) {
                    this.rankID = rank.rankID
                }
            })
            const keys =[ ...this.rankNamesMap.keys() ].sort((a,b) => a-b)
            keys.forEach((key) => {
                this.rankNames.push(this.rankNamesMap.get(key))
            })
        })
         */

    }

    doAction(){
        this.local_data.sortSequence = this.sortSequence
        // this.local_data.rankID = this.rankID
        this.dialogRef.close({event:this.action,data:this.local_data})
    }

    closeDialog(){
        this.dialogRef.close({event:'Cancel'})
    }

}
