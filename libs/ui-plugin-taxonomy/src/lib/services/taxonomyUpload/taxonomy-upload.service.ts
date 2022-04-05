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
import { TaxonService } from '../../services/taxon/taxon.service';
import { TaxonomicAuthorityService } from '../../services/taxonomicAuthority/taxonomicAuthority.service';
import { TaxonQueryBuilder } from '../taxon/taxon-query-builder';

export interface ApiTaxonomyUpload {
    id: number;
    fieldMap: Record<string, string>;
}

@Injectable()
export class TaxonomyUploadService {
    taxonomicAuthorityID = 1 // Value will be set in the constructor

    private readonly jwtToken = this.user.currentUser.pipe(
        map((user) => user.token)
    )
    private readonly _currentUpload = new BehaviorSubject<ApiTaxonomyUpload>(null);

    /**
     * List of fields for the backend taxon entity and related entities
     */
    readonly taxonomyFieldList: Observable<string[]> = of(`${this.appConfig.apiUri()}/taxon/meta/relatedFields`).pipe(
        switchMap((url) => {
            const req = this.api.queryBuilder(url).get().build()

            return this.api.send(req).pipe(
                catchError((e) => {
                    this.alerts.showError(JSON.stringify(e))
                    return []
                })
            )
        }),
        distinctUntilChanged(),
        shareReplay(1)
    )

    readonly currentUpload = this._currentUpload.asObservable();

    constructor(
        private readonly appConfig: AppConfigService,
        private readonly api: ApiClientService,
        private readonly alerts: AlertService,
        private readonly user: UserService,
        private readonly taxonomicAuthorityService: TaxonomicAuthorityService
    ) {
        this.taxonomicAuthorityID = this.taxonomicAuthorityService.getAuthorityID()
        //this.taxonomicAuthorityID = 2;
    }

    setUploadID(id: number): void {
        const url = this.createUrlBuilder().uploadFile().id(id).build();

        combineLatest([
            this.jwtToken,
            this.taxonomyFieldList
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
                    fieldMap[csvField] = this.getMapDefaultValue(csvField, fieldList)
                });
                upload.fieldMap = fieldMap
            }
            this._currentUpload.next(upload)
        })
    }

    setFieldMap(key: string, value: string) {
        const currentUpload = { ...this._currentUpload.getValue() }
        const fieldMap = { ...currentUpload.fieldMap }
        fieldMap[key] = value;
        this._currentUpload.next({
            ...currentUpload,
            fieldMap
        });
    }

    checkFieldMapKeyMapped(key: string) {
        const currentUpload = { ...this._currentUpload.getValue() }
        const fieldMap = { ...currentUpload.fieldMap }
        let flag = false
        Object.keys(fieldMap).forEach((csvField) => {
            if (fieldMap[csvField] == key) {
                flag = true
            }
        })
        return flag
    }

    uploadFile(file: File): Observable<void> {
        const url = this.createUrlBuilder()
            .uploadFile()
            .build()

        const body = new FormData();
        body.append('file', file);

        return this.jwtToken.pipe(
            switchMap((token) => {
                const query = this.api.queryBuilder(url).fileUpload()
                    .addJwtAuth(token)
                    .body(body)
                    .build()

                return this.api.send(query).pipe(
                    catchError((e) => {
                        this.alerts.showError(JSON.stringify(e));
                        return of(null);
                    }),
                )
            }),
            tap((uploadResponse) => {
                this._currentUpload.next(uploadResponse);
            }),
            map(() => null)
        )
    }

    patchFieldMap(/*uniqueIDField: string*/) {
        return combineLatest([
            //this.taxonomicAuthorityID,
            this.jwtToken,
            this.currentUpload,
        ]).pipe(
            //filter(([,, upload]) => upload !== null),
            filter(([, upload]) => upload !== null),
            take(1),
            //switchMap(([authorityID, token, upload]) => {
            switchMap(([token, upload]) => {
                const url = this.createUrlBuilder()
                    .uploadFile()
                    .id(upload.id)
                    .build();

                const query = this.api.queryBuilder(url)
                    .patch()
                    //.queryParam('taxonomicAuthorityID', authorityID)
                    .addJwtAuth(token)
                    .body({
                        //uniqueIDField: uniqueIDField,
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
            //this.taxonomicAuthorityID,
            this.jwtToken,
            this.currentUpload
        ]).pipe(
            //filter(([,, upload]) => upload !== null),
            filter(([, upload]) => upload !== null),
            take(1),
            switchMap(([token, upload]) => {
            //switchMap(([collectionID, token, upload]) => {
                let url = this.createUrlBuilder()
                    .uploadFile()
                    .id(upload.id)
                    .authorityID(this.taxonomicAuthorityID)
                    .build()
                // TODO: Clean this up
                url += '/start';

                const query = this.api.queryBuilder(url)
                    .post()
                    //.queryParam('collectionID', collectionID)
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

    private createUrlBuilder(): TaxonQueryBuilder {
        return new TaxonQueryBuilder(this.appConfig.apiUri());
    }

    getMapDefaultValue(uploadField: string, apiFields: string[]): string {
        for (const field of apiFields) {
            if (field.toLowerCase() === uploadField.toLowerCase()) {
                return field
            }
        }
        return ''
    }
}
