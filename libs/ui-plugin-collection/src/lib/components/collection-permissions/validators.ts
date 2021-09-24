import {
    FormControl,
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { ApiUserRoleName } from '@symbiota2/data-access';
import { CollectionService } from '@symbiota2/ui-plugin-collection';
import { of, Observable } from 'rxjs';
import { map, first, debounce } from 'rxjs/operators';
import { CollectionRoleInput } from '../../dto/CollectionRole.dto';

export class CollectionRoleAsyncValidators {
    static userHasRole(collections: CollectionService): AsyncValidatorFn {
        return (group: AbstractControl): Observable<ValidationErrors> | null => {

            const uid: number = group.get('user').value;
            console.log("userHasRole uid: ", uid);
            
            const role: ApiUserRoleName = group.get('role').value;
            console.log("userHasRole role: ", role);
            
            const roleInput = new CollectionRoleInput(uid, role);

            return collections
                .doesRoleExist(roleInput)
                .pipe(
                    map((result: boolean) => {
                        if(result){
                            console.log("Validator error: ", result);
                            return {userHasRole : true}
                        } else {
                            console.log("Validator no error: ", result)
                        }
                    }
                    )
                );
        };
    }
}
