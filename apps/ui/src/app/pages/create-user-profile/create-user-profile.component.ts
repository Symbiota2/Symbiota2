import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ValidationErrors, ValidatorFn,
    Validators
} from '@angular/forms';
import { UserService } from '@symbiota2/ui-common';

@Component({
    selector: 'symbiota2-create-user-profile',
    templateUrl: './create-user-profile.component.html',
    styleUrls: ['./create-user-profile.component.scss']
})
export class CreateUserProfileComponent {
    static readonly ROUTE = "createprofile";

    readonly usernameField = new FormControl('');
    readonly passwordField = new FormControl(
        '',
        [
            Validators.required,
            Validators.min(8)
        ]
    );
    readonly passwordAgainField = new FormControl(
        '',
        [
            this.checkPasswordsMatch.bind(this)
        ]
    );

    readonly form = new FormGroup({
        'username': this.usernameField,
        'password': this.passwordField,
        'passwordAgain': this.passwordAgainField
    });

    constructor(private readonly users: UserService) { }

    checkPasswordsMatch(): ValidatorFn {
        return (control: FormControl): Record<string, unknown> | null => {
            if (control.value === this.passwordField.value) {
                return null;
            }
            return { passwordMatch: 'Passwords do not match' };
        }
    }

    onSubmit() {

    }
}
