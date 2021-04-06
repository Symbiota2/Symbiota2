import { AbstractControl, FormControl } from '@angular/forms';

const requiredChars = [
    /[A-Z]/,
    /[a-z]/,
    /[0-9]/,
    /[!@#$%^&*()\-=]/,
];

export function passwordsMatch(password: FormControl, passwordAgain: FormControl): Record<string, boolean> | null {
    if (password.value !== passwordAgain.value || passwordAgain.value === '') {
        return { passwordsMatch: true };
    }
    return null;
}

export function passwordContainsCharClasses(password: AbstractControl): Record<string, boolean> | null {
    for (const requiredClass of requiredChars) {
        const passwordVal = password.value as string;
        const matches = passwordVal.match(requiredClass);

        if (matches === null) {
            return { passwordChars: true };
        }
    }
    return null;
}
