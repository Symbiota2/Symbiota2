import {
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InstitutionService } from '../../services/institution.service';

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
}
