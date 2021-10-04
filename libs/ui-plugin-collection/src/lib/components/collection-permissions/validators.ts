import {

    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { ApiUserRoleName } from '@symbiota2/data-access';
import { CollectionService } from '@symbiota2/ui-plugin-collection';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionRoleInput } from '../../dto/CollectionRole.dto';

export class CollectionRoleAsyncValidators {    
    static userHasRole(collections: CollectionService): AsyncValidatorFn {
        return (group: AbstractControl): Observable<ValidationErrors> | null => {

            const uid: number = group.get('user').value;
            
            const role: ApiUserRoleName = group.get('role').value;

            return collections
                .doesRoleExist(uid, role)
                .pipe(
                    map((result: boolean) => result?({userHasRole : result}): null)
                );
        };
    }
}
