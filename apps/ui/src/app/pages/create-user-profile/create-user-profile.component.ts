import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ValidationErrors, ValidatorFn,
    Validators
} from '@angular/forms';
import { UserService } from '@symbiota2/ui-common';
import {
    passwordContainsCharClasses,
    passwordsMatch
} from './validators';

@Component({
    selector: 'symbiota2-create-user-profile',
    templateUrl: './create-user-profile.component.html',
    styleUrls: ['./create-user-profile.component.scss']
})
export class CreateUserProfileComponent {
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

    constructor(private readonly users: UserService) { }

    onSubmit() {
        console.log(this.form.getRawValue());
    }
}
