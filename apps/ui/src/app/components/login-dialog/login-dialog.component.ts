import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { mergeMap, switchMap } from 'rxjs/operators';
import { AlertService, UserService } from "@symbiota2/ui-common";
import { TranslateService } from "@ngx-translate/core";
import { of } from "rxjs";

@Component({
    selector: "app-login-dialog",
    templateUrl: "./login-dialog.component.html",
    styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialog implements OnInit {
    private static readonly I8N_LOGIN_FAILED = "symbiota-auth.auth-service.login_failed";

    username = "";
    password = "";

    constructor(
        private readonly userService: UserService,
        private readonly matDialogRef: MatDialogRef<LoginDialog>,
        private readonly translate: TranslateService,
        private readonly alertService: AlertService) { }

    ngOnInit() {
        this.matDialogRef.afterClosed().pipe(
            switchMap((loginData) => {
               if (loginData) {
                   return of(loginData).pipe(
                       switchMap(({ username, password }) => {
                           return this.userService.login(username, password);
                       }),
                       mergeMap((userData) => {
                           if (userData) {
                               return of("");
                           }
                           else {
                               return this.translate.get(LoginDialog.I8N_LOGIN_FAILED);
                           }
                       })
                   );
               }
               else {
                   return of("");
               }
            }),
        ).subscribe((errMsg) => {
            if (errMsg !== "") {
                this.alertService.showError(errMsg);
            }
        });
    }

    onSubmit() {
        this.matDialogRef.close({
            username: this.username,
            password: this.password
        });
    }

    onCancel() {
        this.matDialogRef.close();
    }

    onEnter() {
        if (this.username !== "" && this.password !== "") {
            this.onSubmit();
        }
    }
}
