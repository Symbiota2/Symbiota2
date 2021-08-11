import {
    FormControl,
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { CollectionService } from '@symbiota2/ui-plugin-collection';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class CollectionAsyncValidators {
    static nameTaken(collections: CollectionService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return collections
                .isNameTaken(control.value)
                .pipe(
                    map((result: boolean) =>
                        result ? { nameTaken: result } : null
                    )
                );
        };
    }

    static codeTaken(collections: CollectionService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return collections
                .isCodeTaken(control.value)
                .pipe(
                    map((result: boolean) =>
                        result ? { codeTaken: true } : null
                    )
                );
        };
    }
}
