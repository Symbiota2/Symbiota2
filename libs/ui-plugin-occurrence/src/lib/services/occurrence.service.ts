import { Injectable } from '@angular/core';
import { OccurrenceQueryBuilder } from './occurrence-query-builder';
import {
    ApiClientService,
    AppConfigService,
    UserService
} from '@symbiota2/ui-common';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Occurrence, OccurrenceListItem } from '../dto';
import {
    ApiOccurrence,
    ApiOccurrenceFindAllParams, ApiOccurrenceListItem
} from '@symbiota2/data-access';

interface FindAllParams {
    collectionIDs: number[];
    catalogNumber?: string;

    limit?: number;
    offset?: number;
}

type OptionalJSON = Record<string, unknown> | null;

@Injectable()
export class OccurrenceService {
    private jwtToken = this.user.currentUser.pipe(
        take(1),
        map((user) => user.token)
    );

    constructor(
        private readonly user: UserService,
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) { }

    findAll(params: Partial<ApiOccurrenceFindAllParams>): Observable<OccurrenceListItem[]> {
        let url = this.createUrlBuilder().findAll()

        for (const key of Object.keys(params)) {
            url = url.queryParam(
                key as keyof ApiOccurrenceFindAllParams,
                params[key]
            );
        }

        const query = this.apiClient.queryBuilder(url.build()).get().build();
        return this.apiClient.send<unknown, ApiOccurrenceListItem[]>(query)
            .pipe(
                catchError((e) => {
                   console.error(e);
                   return [];
                }),
                map((occurrences) => occurrences.map((o) => {
                    return OccurrenceListItem.fromJSON(o);
                }))
            );
    }

    findByID(id: number): Observable<Occurrence> {
        const url = this.createUrlBuilder()
            .findOne()
            .id(id)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send(query)
            .pipe(
                catchError((e) => {
                    console.error(e);
                    return null;
                }),
                map<OptionalJSON, Occurrence>((o) => {
                    if (o === null) {
                        return null;
                    }
                    return Occurrence.fromJSON(o);
                })
            );
    }

    create(collID: number, occurrence: Partial<ApiOccurrence>): Observable<Occurrence> {
        const url = this.createUrlBuilder().create()
            .collectionID(collID)
            .build();

        return this.jwtToken.pipe(
            switchMap((token) => {
                const query = this.apiClient.queryBuilder(url)
                    .addJwtAuth(token)
                    .post()
                    .body([occurrence])
                    .build();

                return this.apiClient.send(query).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null);
                    }),
                    map((occurrenceJson) => {
                        if (occurrenceJson === null) {
                            return null;
                        }
                        return Occurrence.fromJSON(occurrenceJson);
                    })
                )
            })
        )
    }

    postCsv(collectionID: number, csv: File): Observable<boolean> {
        const url = this.createUrlBuilder()
            .upload()
            .collectionID(collectionID)
            .build();
        const body = new FormData();
        body.append('file', csv);

        return this.jwtToken.pipe(
            switchMap((token) => {
                const query = this.apiClient.queryBuilder(url).fileUpload()
                    .addJwtAuth(token)
                    .body(body)
                    .build();

                return this.apiClient.send(query).pipe(
                    map(() => true),
                    catchError((e) => {
                        console.error(e);
                        return of(false);
                    })
                );
            }),
        );
    }

    private createUrlBuilder(): OccurrenceQueryBuilder {
        return new OccurrenceQueryBuilder(this.appConfig.apiUri());
    }
}
