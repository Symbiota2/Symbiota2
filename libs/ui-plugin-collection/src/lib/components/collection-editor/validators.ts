import { ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import {
    FormControl,
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { Collection, CollectionService } from '@symbiota2/ui-plugin-collection';
import { of, Observable } from 'rxjs';
import { map, first, debounce, take, switchMap } from 'rxjs/operators';
import { CollectionInputDto } from '../../dto/Collection.input.dto';

export class CollectionAsyncValidators {
    static nameTaken(collections: CollectionService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return collections.currentCollection.pipe(
                switchMap((collection) => {
                    return collections
                        .isNameTaken(control.value, collection.collectionName)
                        .pipe(
                            map((result: boolean) =>
                                result ? { nameTaken: true } : null
                            )
                        );
                }),
                take(1)
            );
        };
    }

    static codeTaken(collections: CollectionService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return collections.currentCollection.pipe(
                switchMap((collection) => {
                    return collections
                        .isCodeTaken(control.value, collection.collectionCode)
                        .pipe(
                            map((result: boolean) =>
                                result ? { codeTaken: result } : null
                            )
                        );
                }),
                take(1)
            );
        };
    }

    static valuesChanged(collection: Observable<Collection>): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            var updatedCollection: Partial<CollectionInputDto> = new CollectionInputDto(
                control.value
            );

            return collection.pipe(
                map((col) => {
                    if (
                        //Note: could be better way to do this haven't found one though
                        updatedCollection.collectionName ===
                            col.collectionName &&
                        updatedCollection.collectionCode ===
                            col.collectionCode &&
                        updatedCollection.institutionID == col.institution.id &&
                        updatedCollection.fullDescription ===
                            col.fullDescription &&
                        updatedCollection.homePage === col.homePage &&
                        updatedCollection.contact === col.contact &&
                        updatedCollection.email === col.email &&
                        updatedCollection.latitude == col.latitude &&
                        updatedCollection.longitude == col.longitude &&
                        updatedCollection.rights === col.rights &&
                        updatedCollection.icon === col.icon &&
                        updatedCollection.type === col.type &&
                        updatedCollection.managementType === col.managementType
                    ) {
                        console.log('valuesChanged: no changes');
                        return { noChanges: true };
                    } else {
                        return null;
                    }
                }),
                take(1)
            );
        };
    }
}
