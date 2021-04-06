import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'symbiota2-signup-error',
    styles: [`
        .error {
            color: red;
        }

        .error-ok {
            color: green;
        }
    `],
    template: `
        <div [className]='hasError ? "error" : "error-ok"'>
            {{ hasError ? '&#x274C;' : '&#x2705;' }} {{ displayText }}
        </div>
    `
})
export class ErrorComponent {
    @Input() formControlInput: FormControl;
    @Input() errorName: string;
    @Input() displayText: string;

    get hasError() {
        return !this.formControlInput.dirty || this.formControlInput.hasError(this.errorName);
    }
}
