import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AlertModule } from '../alert.module';

@Injectable({
    providedIn: AlertModule
})
export class AlertService {
    public static readonly MSG_DURATION = 4000;

    constructor(private snackbar: MatSnackBar) { }

    showMessage(message: string) {
        this.snackbar.open(
            message,
            '',
            { duration: AlertService.MSG_DURATION, 
                panelClass: ["message-snackbar"]}
        );

        console.log(message);
    }

    showError(message: string) {
        this.snackbar.open(
            message,
            "",
            {
                duration: AlertService.MSG_DURATION,
                panelClass: ["error-snackbar"]
            }
        );

        console.error(message);
    }
}
