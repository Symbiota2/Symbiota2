import {
    FormControl,
} from '@angular/forms';
import { AsyncValidator, ControlSetValueArgs, ValidatorOrOpts } from './validators';

export class TypedFormControl<T> extends FormControl {
    value: T;

    constructor(initialValue: T, validatorOrOpts?: ValidatorOrOpts, asyncValidator?: AsyncValidator) {
        super(initialValue, validatorOrOpts, asyncValidator);
    }

    setValue(value: T, options?: ControlSetValueArgs) {
        super.setValue(value, options);
    }
}
