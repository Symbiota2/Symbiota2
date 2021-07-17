import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, ApiClientService } from '@symbiota2/ui-common';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'symbiota2-forgot-username',
    templateUrl: './forgot-username.component.html',
    styleUrls: ['./forgot-username.component.scss']
})
export class ForgotUsernamePage {
    private static readonly API_ROUTE_FORGOT_USERNAME = 'users/forgotUsername';

    controlEmail = new FormControl('', [Validators.email])
    form = new FormGroup({ email: this.controlEmail });

    constructor(
        private readonly router: Router,
        private readonly alerts: AlertService,
        private readonly api: ApiClientService) { }

    onSubmit() {
        const req = this.api.queryBuilder(`${this.api.apiRoot()}/${ForgotUsernamePage.API_ROUTE_FORGOT_USERNAME}`)
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
                this.alerts.showMessage('If the email address exists, the username has been sent.');
                this.router.navigate(['/']);
            }
        });
    }
}
