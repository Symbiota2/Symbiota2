import {
    AbstractControlOptions,
    AsyncValidatorFn,
    ValidatorFn
} from '@angular/forms';

export interface GroupSetValueArgs {
    onlySelf?: boolean;
    emitEvent?: boolean;
}

export interface ControlSetValueArgs extends GroupSetValueArgs {
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean
}

export type ValidatorOrOpts = ValidatorFn | ValidatorFn[] | AbstractControlOptions;
export type AsyncValidator = AsyncValidatorFn | AsyncValidatorFn[];
