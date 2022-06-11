import { Component, Inject, Optional, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog';
//import { CommonNameInfo } from '../taxon-vernacular-editor/taxon-vernacular-editor.component';
import { TranslateService } from '@ngx-translate/core'
import { EditableTextDialogComponent } from '../editable-text-dialog/editable-text-dialog.component';
// import { UserService } from '../../user';
import { filter } from 'rxjs/operators';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { I18nService } from '../../services';

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
    @Input() params = ""
    @Input() hide = false
    userID : number = null
    userCanEdit = false
    userIsEditing: boolean = false
    currentUser = this.userService.currentUser
    user

    constructor(
        private readonly userService: UserService,
        private readonly i18nService: I18nService,
        private readonly alertService: AlertService,
        private readonly translate: TranslateService,
        // @Optional() is used to prevent error if no data is passed
        public dialog: MatDialog,
        // @Optional() @Inject(MAT_DIALOG_DATA) public data: CommonNameInfo
    )
    {
    }

    ngOnInit() {
        this.userService.iAmEditing.subscribe(x => this.userIsEditing = x);
        this.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.user = user
                this.userID = user.uid
                this.userCanEdit = user.canEditProject(user.uid)
                /*
                console.log("user can edit " + this.userCanEdit)
                user.isEditing().subscribe((value) => {
                    console.log(" user is editing " + value)
                    this.userIsEditing = value
                })
                 */
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
                const returnCode =
                    this.i18nService
                        .update(
                            this.translate.currentLang,
                            this.key,
                            result.value,
                            result.translatable)
                        .subscribe()
                if (returnCode == null) {
                    this.showError("i18n.editable.save.error.message")
                } else {
                    // this.translate.reloadLang(this.translate.currentLang)
                    this.translate.set(this.key, result.value, this.translate.currentLang)
                    this.showMessage("i18n.editable.save.worked.message")
                }
            }
        })
    }

    /*
    Internal routine to encapsulate the show error message at the bottom in case something goes awry
    */
    private showError(s) {
        this.translate.get(s).subscribe((r)  => {
            this.alertService.showError(r)
        })
    }

    /*
    Internal routine to encapsulate the show message at the bottom to confirm things actually happened
    */
    private showMessage(s) {
        this.translate.get(s).subscribe((r)  => {
            this.alertService.showMessage(r)
        })
    }
}
