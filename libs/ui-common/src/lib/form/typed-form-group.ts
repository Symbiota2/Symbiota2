import { FormGroup } from '@angular/forms';
import { TypedFormControl } from '@symbiota2/ui-common';
import {
    AsyncValidator,
    GroupSetValueArgs,
    ValidatorOrOpts
} from './validators';

type GroupControls<T> = { [k in keyof T]: TypedFormControl<any> };

export class TypedFormGroup<T> extends FormGroup {
    value: T;

    constructor(controls: GroupControls<T>, validatorOrOpts?: ValidatorOrOpts, asyncValidator?: AsyncValidator) {
        super(controls, validatorOrOpts, asyncValidator);
    }

    setValue(value: { [p in keyof T]: typeof value[p] }, options?: GroupSetValueArgs) {
        super.setValue(value, options);
    }
}
