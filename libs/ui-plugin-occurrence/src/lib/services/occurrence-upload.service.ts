import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
    catchError,
    distinctUntilChanged, filter, finalize,
    map,
    shareReplay,
    switchMap, take,
    tap
} from 'rxjs/operators';
import {
    AlertService,
    ApiClientService,
    AppConfigService, UserService
} from '@symbiota2/ui-common';
import { ApiOccurrenceUpload } from '@symbiota2/data-access';
import { CollectionService } from '@symbiota2/ui-plugin-collection';
import { OccurrenceQueryBuilder } from './occurrence-query-builder';

@Injectable()
export class OccurrenceUploadService {
    private readonly collectionID = this.collections.currentCollection.pipe(
        map((collection) => collection.id)
    );
    private readonly jwtToken = this.user.currentUser.pipe(
        map((user) => user.token)
    );
    private readonly _currentUpload = new BehaviorSubject<ApiOccurrenceUpload>(null);

    /**
     * List of fields for the backend occurrence entity
     */
    readonly occurrenceFieldList: Observable<string[]> = of(`${this.appConfig.apiUri()}/occurrences/meta/fields`).pipe(
        switchMap((url) => {
            const req = this.api.queryBuilder(url).get().build();

            return this.api.send(req).pipe(
                catchError((e) => {
                    this.alerts.showError(JSON.stringify(e));
                    return [];
                })
            );
        }),
        distinctUntilChanged(),
        shareReplay(1)
    );

    readonly currentUpload = this._currentUpload.asObservable();

    constructor(
        private readonly appConfig: AppConfigService,
        private readonly api: ApiClientService,
        private readonly alerts: AlertService,
        private readonly user: UserService,
        private readonly collections: CollectionService) { }

    setUploadID(id: number): void {
        const url = this.createUrlBuilder().upload().id(id).build();

        combineLatest([
            this.jwtToken,
            this.occurrenceFieldList
        ]).pipe(
            switchMap(([token, fieldList]) => {
                const query = this.api.queryBuilder(url)
                    .get()
                    .addJwtAuth(token)
                    .build();

                return this.api.send(query).pipe(
                    catchError((e) => {
                        this.alerts.showError(JSON.stringify(e));
                        return of(null);
                    }),
                    map((upload) => {
                        return [fieldList, upload]
                    })
                );
            })
        ).subscribe(([fieldList, upload]) => {
            if (upload !== null) {
                const fieldMap = { ...upload.fieldMap };
                Object.keys(fieldMap).forEach((csvField) => {
                    fieldMap[csvField] = this.getMapDefaultValue(csvField, fieldList);
                });
                upload.fieldMap = fieldMap;
            }
            this._currentUpload.next(upload)
        });
    }

    setFieldMap(key: string, value: string) {
        const currentUpload = { ...this._currentUpload.getValue() };
        const fieldMap = { ...currentUpload.fieldMap };
        fieldMap[key] = value;
        this._currentUpload.next({
            ...currentUpload,
            fieldMap
        });
    }

    uploadFile(file: File): Observable<void> {
        const url = this.createUrlBuilder()
            .upload()
            .build();

        const body = new FormData();
        body.append('file', file);

        return this.jwtToken.pipe(
            switchMap((token) => {
                const query = this.api.queryBuilder(url).fileUpload()
                    .addJwtAuth(token)
                    .body(body)
                    .build();

                return this.api.send(query).pipe(
                    catchError((e) => {
                        this.alerts.showError(JSON.stringify(e));
                        return of(null);
                    }),
                );
            }),
            tap((uploadResponse) => {
                this._currentUpload.next(uploadResponse);
            }),
            map(() => null)
        );
    }

    patchFieldMap(uniqueIDField: string) {
        return combineLatest([
            this.collectionID,
            this.jwtToken,
            this.currentUpload,
        ]).pipe(
            filter(([,, upload]) => upload !== null),
            take(1),
            switchMap(([collectionID, token, upload]) => {
                const url = this.createUrlBuilder()
                    .upload()
                    .id(upload.id)
                    .build();

                const query = this.api.queryBuilder(url)
                    .patch()
                    .queryParam('collectionID', collectionID)
                    .addJwtAuth(token)
                    .body({
                        uniqueIDField: uniqueIDField,
                        fieldMap: upload.fieldMap
                    })
                    .build();

                return this.api.send(query).pipe(
                    catchError((e) => {
                        this.alerts.showError(JSON.stringify(e));
                        return of(null);
                    }),
                );
            })
        );
    }

    startUpload(): Observable<Error> {
        return combineLatest([
            this.collectionID,
            this.jwtToken,
            this.currentUpload
        ]).pipe(
            filter(([,, upload]) => upload !== null),
            take(1),
            switchMap(([collectionID, token, upload]) => {
                let url = this.createUrlBuilder()
                    .upload()
                    .id(upload.id)
                    .build();
                // TODO: Clean this up
                url += '/start';

                const query = this.api.queryBuilder(url)
                    .post()
                    .queryParam('collectionID', collectionID)
                    .addJwtAuth(token)
                    .build();

                return this.api.send(query).pipe(
                    catchError((e) => {
                        this.alerts.showError(JSON.stringify(e));
                        return of(e);
                    }),
                    finalize(() => {
                        this._currentUpload.next(null);
                    })
                );
            })
        );
    }

    private createUrlBuilder(): OccurrenceQueryBuilder {
        return new OccurrenceQueryBuilder(this.appConfig.apiUri());
    }

    getMapDefaultValue(uploadField: string, apiFields: string[]): string {
        for (const field of apiFields) {
            if (field.toLowerCase() === uploadField.toLowerCase()) {
                return field;
            }
        }
        return '';
    }
}
