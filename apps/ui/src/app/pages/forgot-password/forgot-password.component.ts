import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, ApiClientService } from '@symbiota2/ui-common';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'symbiota2-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordPage {
    private static readonly API_ROUTE_FORGOT_PASSWORD = 'users/forgotPassword';

    formControlUsername = new FormControl('');
    form = new FormGroup({ 'username': this.formControlUsername });

    constructor(
        private readonly router: Router,
        private readonly alerts: AlertService,
        private readonly api: ApiClientService) { }

    onSubmit() {
        const req = this.api.queryBuilder(`${this.api.apiRoot()}/${ForgotPasswordPage.API_ROUTE_FORGOT_PASSWORD}`)
            .post()
            .body(this.form.value)
            .build();

        this.api.send(req).pipe(
            map(() => true),
            catchError((e: HttpErrorResponse) => {
                this.alerts.showError(e.message);
                return of(false);
            })
        ).subscribe((success) => {
            if (success) {
                // TODO: i18n
                this.alerts.showMessage('If the username exists, a new password has been sent to the associated email address.');
                this.router.navigate(['/']);
            }
        });
    }
}
