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
import { ImageQueryBuilder } from '../image/image-query-builder';

export interface ApiImageFolderUpload {
    id: number;
    fieldMap: Record<string, string>;
}

@Injectable()
export class ImageFolderUploadService {

    private readonly jwtToken = this.user.currentUser.pipe(
        map((user) => user.token)
    )
    private readonly _currentUpload = new BehaviorSubject<ApiImageFolderUpload>(null);

    readonly currentUpload = this._currentUpload.asObservable();

    constructor(
        private readonly appConfig: AppConfigService,
        private readonly api: ApiClientService,
        private readonly alerts: AlertService,
        private readonly user: UserService
    ) {
    }

    setUploadID(id: number): void {
        const url = this.createUrlBuilder().upload().id(id).build();

        combineLatest([
            this.jwtToken
        ]).pipe(
            switchMap(([token]) => {
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
                        return [upload]
                    })
                );
            })
        ).subscribe(([upload]) => {
            this._currentUpload.next(upload)
        })
    }


    startUpload(): Observable<Error> {
        return combineLatest([
            this.jwtToken,
            this.currentUpload
        ]).pipe(
            filter(([, upload]) => upload !== null),
            take(1),
            switchMap(([token, upload]) => {
                let url = this.createUrlBuilder()
                    .zipFileUpload()
                    .id(upload.id)
                    .build()
                // TODO: Clean this up
                url += '/start';

                const query = this.api.queryBuilder(url)
                    .post()
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

    uploadFile(file: File): Observable<void> {
        const url = this.createUrlBuilder()
            .zipFileUpload()
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

    /*
    startUpload(): Observable<Error> {
        return combineLatest([
            this.jwtToken,
            this.currentUpload
        ]).pipe(
            filter(([upload]) => upload !== null),
            take(1),
            switchMap(([token, upload]) => {
            //switchMap(([collectionID, token, upload]) => {
                let url = this.createUrlBuilder()
                    .upload()
                    .id(upload.id)
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
     */

    private createUrlBuilder(): ImageQueryBuilder {
        return new ImageQueryBuilder(this.appConfig.apiUri());
    }

}
