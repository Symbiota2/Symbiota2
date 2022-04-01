import {
    FormControl,
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { Collection, CollectionService } from '@symbiota2/ui-plugin-collection';
import { of, Observable } from 'rxjs';
import { map, first, debounce, take, switchMap } from 'rxjs/operators';
import { CollectionInputDto } from '../dto/Collection.input.dto';

export class CollectionAsyncValidators {
    static nameTaken(
        collectionService: CollectionService,
        isEditing?: boolean
    ): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            if (isEditing) {
                return collectionService.currentCollection.pipe(
                    switchMap((collection) => {
                        return collectionService
                            .isNameTaken(
                                control.value,
                                collection.collectionName
                            )
                            .pipe(
                                map((result: boolean) =>
                                    result ? { nameTaken: true } : null
                                )
                            );
                    }),
                    take(1)
                );
            } else {
                return collectionService
                    .isNameTaken(control.value)
                    .pipe(
                        map((result: boolean) =>
                            result ? { nameTaken: true } : null
                        )
                    );
            }
        };
    }

    static codeTaken(
        collectionService: CollectionService,
        isEditing?: boolean
    ): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            if (isEditing) {
                return collectionService.currentCollection.pipe(
                    switchMap((collection) => {
                        return collectionService
                            .isCodeTaken(
                                control.value,
                                collection.collectionCode
                            )
                            .pipe(
                                map((result: boolean) =>
                                    result ? { codeTaken: result } : null
                                )
                            );
                    }),
                    take(1)
                );
            } else {
                return collectionService
                    .isCodeTaken(control.value)
                    .pipe(
                        map((result: boolean) =>
                            result ? { codeTaken: result } : null
                        )
                    );
            }
        };
    }

    static valuesChanged(collection: Observable<Collection>): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            var updatedCollection: Partial<CollectionInputDto> = new CollectionInputDto(
                control.value
            );

            return collection.pipe(
                map((col) => {
                    for (let [field, value] of Object.entries(collection)) {
                    }
                    if (
                        //NOTE: could be better way to do this haven't found one though
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
