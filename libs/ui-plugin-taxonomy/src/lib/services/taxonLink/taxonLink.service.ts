import { Observable, of } from 'rxjs';
import { ApiClientService, AppConfigService, UserService } from '@symbiota2/ui-common';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TaxonLinkQueryBuilder } from './taxonLink-query-builder';
import { TaxonLinkListItem } from '../../dto/taxonLink-list-item';

interface FindAllParams {
    taxonIDs?: number[]
    ids?: number[]
    limit?: number
    offset?: number
}

@Injectable()
export class TaxonLinkService {
    private jwtToken = this.user.currentUser.pipe(map((user) => user.token))

    constructor(
        private readonly apiClient: ApiClientService,
        private readonly user: UserService,
        private readonly appConfig: AppConfigService) { }

    private createQueryBuilder(): TaxonLinkQueryBuilder {
        return new TaxonLinkQueryBuilder(this.appConfig.apiUri());
    }

    public getUrl() {
        const apiBaseUrl = this.appConfig.apiUri()
        const x = new URL(`${apiBaseUrl}/taxonLink`)
        return this.apiClient.apiRoot()
    }

    findAll(params?: FindAllParams): Observable<TaxonLinkListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .ids(params?.ids? params.ids : [])
            .taxonIDs(params?.taxonIDs? params.taxonIDs : [])
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((links) => links.map((o) => {
                    return TaxonLinkListItem.fromJSON(o);
                }))
            );
    }

    findByID(id: number): Observable<TaxonLinkListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonLinkListItem.fromJSON(o)))

    }

    /**
     * sends request to api to delete a taxon resource link record
     * @param id - the id of the taxon resource link to delete
     * @returns Observable of response from api casted as `string`
     * @returns `of(null)` if taxon does not exist or does not have editing permission or api errors
     */
    delete(id): Observable<string> {
        const url = this.createQueryBuilder()
            .delete()
            .id(id)
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const req = this.apiClient
                    .queryBuilder(url)
                    .delete()
                    .addJwtAuth(token)
                    .build()

                return this.apiClient.send(req).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((blockJson) => {
                        return "success"
                    })
                )
            })
        )
    }
}
