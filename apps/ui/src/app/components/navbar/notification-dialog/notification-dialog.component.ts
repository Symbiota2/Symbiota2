import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiUserNotification } from '@symbiota2/data-access';

// TODO: i18n
@Component({
    selector: 'symbiota2-notification-dialog',
    template: `
        <div id='notification-dialog'>
            <div mat-dialog-content>
                <p id='created-at'>{{ data.createdAt | date: 'medium' }}</p>
                <p>{{ data.message }}</p>
            </div>
            <div mat-dialog-actions>
                <button mat-raised-button (click)='onClose()'>
                    Keep
                </button>
                <button mat-raised-button color='primary' (click)='onDismiss()'>
                    Dismiss
                </button>
            </div>
        </div>
    `,
    styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialog {
    constructor(
        private readonly dialogRef: MatDialogRef<NotificationDialog>,
        @Inject(MAT_DIALOG_DATA) readonly data: ApiUserNotification) { }

    /**
     * Notification should be kept
     */
    onClose() {
        this.dialogRef.close(false);
    }

    /**
     * Notification should be deleted
     */
    onDismiss() {
        this.dialogRef.close(true);
    }
}
