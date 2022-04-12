import {
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InstitutionService } from '../services/institution/institution.service';

export class InstitutionAsyncValidators {
    static nameTaken(inst: InstitutionService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return inst
                .isNameTaken(control.value)
                .pipe(
                    map((result: boolean) =>
                        result ? { nameTaken: result } : null
                    )
                );
        };
    }

    static codeTaken(inst: InstitutionService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return inst
                .isCodeTaken(control.value)
                .pipe(
                    map((result: boolean) =>
                        result ? { codeTaken: result } : null
                    )
                );
        };
    }
}
