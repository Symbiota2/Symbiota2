/// <reference types="@types/grecaptcha" />

import { Component, Inject, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { AlertService, UserService } from '@symbiota2/ui-common';
import {
    passwordContainsCharClasses,
    passwordsMatch
} from './validators';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'symbiota2-create-user-profile',
    templateUrl: './create-user-profile.component.html',
    styleUrls: ['./create-user-profile.component.scss']
})
export class CreateUserProfileComponent implements OnInit {
    static readonly ROUTE = "createprofile";

    readonly PASSWORD_MIN_CHARS = 8;

    readonly usernameField = new FormControl('', [Validators.required]);
    readonly firstNameField = new FormControl('', [Validators.required]);
    readonly lastNameField = new FormControl('', [Validators.required]);
    readonly passwordField = new FormControl(
        '',
        [
            Validators.required,
            Validators.minLength(this.PASSWORD_MIN_CHARS),
            passwordContainsCharClasses
        ]
    );
    readonly passwordAgainField = new FormControl(
        '',
        [(passwordAgainField) => passwordsMatch(this.passwordField, passwordAgainField as FormControl)]
    );
    readonly emailAddressField = new FormControl(
        '',
        [Validators.required, Validators.email]
    );

    readonly titleField = new FormControl('');
    readonly institutionField = new FormControl('');
    readonly departmentField = new FormControl('');
    readonly addressField = new FormControl('');
    readonly cityField = new FormControl('');
    readonly stateField = new FormControl('');
    readonly zipField = new FormControl('');
    readonly countryField = new FormControl('');
    readonly phoneField = new FormControl('');
    readonly urlField = new FormControl('');
    readonly bioField = new FormControl('');
    readonly isPublicField = new FormControl(false);

    readonly form = new FormGroup({
        username: this.usernameField,
        firstName: this.firstNameField,
        lastName: this.lastNameField,
        password: this.passwordField,
        passwordAgain: this.passwordAgainField,
        email: this.emailAddressField,
        title: this.titleField,
        city: this.cityField,
        state: this.stateField,
        country: this.countryField,
        zip: this.zipField,
        url: this.urlField,
        biography: this.bioField,
        isPublic: this.isPublicField
    });

    recaptchaOK = false;

    constructor(
        @Inject(DOCUMENT) private readonly document: Document,
        private readonly users: UserService,
        private readonly router: Router) { }

    ngOnInit() {
        const googleScript = document.createElement("script");
        googleScript.src = `https://www.google.com/recaptcha/api.js`;
        googleScript.async = true;
        googleScript.defer = true;
        document.body.append(googleScript);

        googleScript.addEventListener('load', () => {
            grecaptcha.ready(() => {
                grecaptcha.render('recaptcha', {
                    sitekey: environment.recaptchaSiteKey,
                    callback: this.onRecaptchaOK.bind(this)
                });
            });
        }, { once: true });
    }

    onRecaptchaOK() {
        this.recaptchaOK = true;
    }

    onSubmit() {
        const { passwordAgain, ...formData } = this.form.getRawValue();
        this.users.create(formData).subscribe(() => {
            return this.router.navigate([UserProfileComponent.ROUTE])
        });
    }
}
