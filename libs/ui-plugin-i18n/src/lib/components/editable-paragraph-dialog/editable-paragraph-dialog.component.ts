import { Component, Inject, Input, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core'
import { FormControl } from '@angular/forms';

@Component({
    selector: 'symbiota2-editable-paragraph-dialog-box',
    templateUrl: 'editable-paragraph-dialog.component.html',
    styleUrls: ['editable-paragraph-dialog.component.scss']
})
//this the dialog box that the edible field pencil opens. There's not much to explain here,
//it is essentially a simplified version of dialog box components already in the program
export class EditableParagraphDialogComponent {
    @Input() control: FormControl
    currentLanguage = ""
    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) public data: string,
        public dialogRef: MatDialogRef<EditableParagraphDialogComponent>,
        private readonly translate: TranslateService,
        )
    {
    }

    ngOnInit() {
        this.control = this.control ?? new FormControl()
        this.currentLanguage = this.translate.currentLang
        this.translate.get(this.data).subscribe((value) => {
            this.control.setValue(value)
        })
    }

    //This is what happens when the user clicks save on the dialog. The box is closed,
    //and the html text element and it's contents are returned to the editable field
    //component giving it the information that it needs to edit the text
    doAction(){
        //this.dialogRef.close({event:document.getElementById("action")})
        this.currentLanguage = this.translate.currentLang
        console.log(this.control.value)
        this.dialogRef.close({event: this.control.value})
    }

    //This is what is triggered when the user hits cancel. The box simply closes and the cancel
    //text is return to the editable field component, letting it know that nothing should be
    //done
    closeDialog(){
        this.dialogRef.close({event:'zzzCancel'})
    }

}
