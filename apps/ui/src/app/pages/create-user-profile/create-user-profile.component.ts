/// <reference types="@types/grecaptcha" />

import { Component, Inject, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { UserService } from '@symbiota2/ui-common';
import {
    passwordContainsCharClasses,
    passwordsMatch
} from './validators';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';

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

    readonly form = new FormGroup({
        'username': this.usernameField,
        'firstName': this.firstNameField,
        'lastName': this.lastNameField,
        'password': this.passwordField,
        'passwordAgain': this.passwordAgainField,
        'email': this.emailAddressField
    });

    recaptchaOK = false;

    constructor(
        @Inject(DOCUMENT) private readonly document: Document,
        private readonly users: UserService) { }

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
        console.log(this.form.getRawValue());
    }
}
