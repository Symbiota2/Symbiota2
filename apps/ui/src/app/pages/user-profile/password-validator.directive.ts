import {
    FormGroup,
    NG_VALIDATORS, ValidationErrors,
    Validator,
} from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
    selector: '[checkPasswords]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: PasswordFormValidator,
        multi: true
    }]
})
export class PasswordFormValidator implements Validator {
    public static readonly FIELD_PWD = "password";
    public static readonly FIELD_PWD_AGAIN = "passwordAgain";

    public static readonly ERR_PWD_MATCH = "core.user.user_password.password_match_error";
    public static readonly ERR_PWD_LEN = "core.user.user_password.password_long_error";
    public static readonly ERR_PWD_NUM = "core.user.user_password.password_number_error";
    public static readonly ERR_PWD_CASE = "core.user.user_password.password_letter_error";

    public static readonly ERRORS = [
        PasswordFormValidator.ERR_PWD_MATCH,
        PasswordFormValidator.ERR_PWD_LEN,
        PasswordFormValidator.ERR_PWD_NUM,
        PasswordFormValidator.ERR_PWD_CASE
    ];

    private static readonly PWD_MIN_LEN = 8;

    validate(form: FormGroup): ValidationErrors {
        const pwd = form.get(PasswordFormValidator.FIELD_PWD)?.value as string;
        const pwdAgain = form.get(PasswordFormValidator.FIELD_PWD_AGAIN)?.value as string;
        const errors = {};

        let hasErr = false;

        if (!(pwd && pwdAgain)) {
            return { stillLoading: true };
        }

        if (pwd !== pwdAgain) {
            hasErr = true;
            errors[PasswordFormValidator.ERR_PWD_MATCH] = true;
        }

        if (pwd.length < PasswordFormValidator.PWD_MIN_LEN) {
            hasErr = true;
            errors[PasswordFormValidator.ERR_PWD_LEN] = true;
        }

        if (!/\d/.test(pwd)) {
            hasErr = true;
            errors[PasswordFormValidator.ERR_PWD_NUM] = true;
        }

        // TODO: Update i18n to require upper AND lower instead of upper OR lower
        if (!(/[a-z]/.test(pwd) && /[A-Z]/.test(pwd))) {
            hasErr = true;
            errors[PasswordFormValidator.ERR_PWD_CASE] = true;
        }

        return hasErr ? errors : null;
    }
}
