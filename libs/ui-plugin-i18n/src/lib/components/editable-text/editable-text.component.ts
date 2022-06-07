import { Component, Inject, Optional, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
//import { CommonNameInfo } from '../taxon-vernacular-editor/taxon-vernacular-editor.component';
import { TranslateService } from '@ngx-translate/core'
import { EditableTextDialogComponent } from '../editable-text-dialog/editable-text-dialog.component';
// import { UserService } from '../../user';
import { filter } from 'rxjs/operators';
import { UserService } from '@symbiota2/ui-common';

@Component({
    selector: 'symbiota2-editable-text',
    templateUrl: 'editable-text.component.html',
    styleUrls: ['editable-text.component.scss']
})

//This is the base editable field component. There is a @input decorator called key, which allows
//you to switch any translated text fields in html that would normally be formatted like this:
// <h1> {{ "taxon.editor.descriptionBlock" | translate}} </h1>
// to this :
// <h1> <symbiota2-editable-text key='taxon.editor.descriptionBlock'></symbiota2-editable-text></h1>
// This will add a pencil edit button to the text field that will open a dialogue box allowing
// the user to edit the key. The html file in this component will then handle the translate
// operation

export class EditableTextComponent {
    @Input() key = '';
    userID : number = null
    userCanEdit = true

    constructor(
        private readonly userService: UserService,
        // @Optional() is used to prevent error if no data is passed
        public dialog: MatDialog,
        // @Optional() @Inject(MAT_DIALOG_DATA) public data: CommonNameInfo
    )
    {
    }

    ngOnInit() {
        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditTaxon(user.uid)
            })
    }

    //This opens up the taxon editable field dialog box component in a way that mimics how other
    // dialog boxes are opened up throughout the project
    openDialog() {
        const dialogRef = this.dialog.open(EditableTextDialogComponent, {
                width: '90%',
                data: this.key,

            })

        //This is where all the action happens. result.event contains all of the information
        //from the dialogue box. If the user hits cancel, nothing happens. Otherwise,
        // edited value is set the value the user entered
        // in the dialog box text box.
        dialogRef.afterClosed().subscribe(result => {
            if (result.event != 'zzzCancel') {
                const editedValue = result.event;
                this.key= editedValue;
            }
        })
    }

}
