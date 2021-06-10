/// <reference types="@types/grecaptcha" />

import {
    ChangeDetectorRef,
    Component, Directive,
    EventEmitter,
    Inject,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import {
    AlertService,
    ROUTE_USER_PROFILE,
    UserService
} from '@symbiota2/ui-common';
import {
    passwordContainsCharClasses,
    passwordsMatch
} from './validators';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { combineAll, map, startWith, switchMap, tap } from 'rxjs/operators';

/**
 * User signup page
 */
@Component({
    selector: 'symbiota2-create-user-profile',
    templateUrl: './create-user-profile.component.html',
    styleUrls: ['./create-user-profile.component.scss']
})
export class CreateUserProfileComponent implements OnInit {
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

    readonly recaptchaOk$ = new BehaviorSubject<boolean>(false);
    readonly submitDisabled$ = combineLatest([
        this.recaptchaOk$,
        this.form.statusChanges.pipe(startWith(this.form.status))
    ]).pipe(
        map(([recaptchaOK, formStatus]) => {
            return !(recaptchaOK && formStatus === "VALID");
        }),
        startWith(true)
    );

    constructor(
        @Inject(DOCUMENT) private readonly document: Document,
        private readonly changeDetector: ChangeDetectorRef,
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
                    callback: this.onRecaptchaChange.bind(this)
                });
            });
        }, { once: true });
    }

    onRecaptchaChange() {
        this.recaptchaOk$.next(true);
        this.changeDetector.detectChanges();
    }

    onSubmit() {
        const { passwordAgain, ...formData } = this.form.getRawValue();
        this.users.create(formData).subscribe(() => {
            return this.router.navigate([ROUTE_USER_PROFILE])
        });
    }
}
