import { Observable, of } from 'rxjs';
import { AlertService, ApiClientService, AppConfigService, UserService } from '@symbiota2/ui-common';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Taxon, TaxonListItem } from '../../dto';
import { TaxonVernacularQueryBuilder } from './taxonVernacular-query-builder';
import { TaxonVernacularListItem } from '../../dto/taxonVernacular-list-item';
import { TaxonInputDto } from '../../dto/taxonInputDto';
import { TaxonQueryBuilder } from '../taxon/taxon-query-builder';
import { TaxonVernacularInputDto } from '../../dto/taxonVernacularInputDto';
import { TaxonIDAuthorNameItem } from '../../dto/taxon-id-author-name-item';

interface FindAllParams {
    IDs: number[]
    limit?: number
}

@Injectable()
export class TaxonVernacularService {
    private jwtToken = this.user.currentUser.pipe(map((user) => user.token))

    constructor(
        private readonly alerts: AlertService,
        private readonly user: UserService,
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) { }

    private createQueryBuilder(): TaxonVernacularQueryBuilder {
        return new TaxonVernacularQueryBuilder(this.appConfig.apiUri());
    }

    public getUrl() {
        const apiBaseUrl = this.appConfig.apiUri()
        const x = new URL(`${apiBaseUrl}/taxonVernacular`)
        return this.apiClient.apiRoot()
    }

    /*
    findCommonName(name: string, authorityID?: number): Observable<TaxonVernacularListItem> {
        const url = this.createQueryBuilder()
            .findCommonName(name)
            .authorityID(authorityID)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, TaxonVernacularListItem>(query)
    }
     */

    findByCommonName(name: string, authorityID?: number): Observable<TaxonVernacularListItem[]> {
        const url = this.createQueryBuilder()
            .findByCommonName(name)
            .authorityID(authorityID)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, TaxonVernacularListItem[]>(query)
    }

    findAllCommonNamesByLanguage(language: string, partialName: string, authorityID?: number): Observable<TaxonIDAuthorNameItem[]> {
        const url = this.createQueryBuilder()
            .findAllCommonNamesByLanguage(language)
            .authorityID(authorityID)
            .partialName(partialName)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, TaxonIDAuthorNameItem[]>(query)
    }

    /*
    findAllCommonNamesByLanguage(language: string, partialName: string, authorityID?: number): Observable<string[]> {
        const url = this.createQueryBuilder()
            .findAllCommonNamesByLanguage(language)
            .authorityID(authorityID)
            .partialName(partialName)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }
     */

    findAllCommonNames(partialName: string, authorityID?: number): Observable<TaxonIDAuthorNameItem[]> {
        const url = this.createQueryBuilder()
            .findAllCommonNames()
            .authorityID(authorityID)
            .partialName(partialName)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, TaxonIDAuthorNameItem[]>(query)
    }

    /*
    findAllCommonNames(partialName: string, authorityID?: number): Observable<string[]> {
        const url = this.createQueryBuilder()
            .findAllCommonNames()
            .authorityID(authorityID)
            .partialName(partialName)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }
     */

    findAllLanguages(authorityID?: number): Observable<string[]> {
        const url = this.createQueryBuilder()
            .findAllLanguages()
            .authorityID(authorityID)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }

    findAll(authorityID?: number, params?: FindAllParams): Observable<TaxonVernacularListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .IDs(params?.IDs)
            .authorityID(authorityID)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((taxons) => taxons.map((o) => {
                    return TaxonVernacularListItem.fromJSON(o);
                }))
            );
    }

    findByTaxonID(taxonID: number): Observable<TaxonVernacularListItem[]> {
        const url = this.createQueryBuilder()
            .findByTaxonID(taxonID)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((taxons) => taxons.map((o) => {
                    return TaxonVernacularListItem.fromJSON(o);
                }))
            );
    }

    findByID(id: number): Observable<TaxonVernacularListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonVernacularListItem.fromJSON(o)))

    }


    /**
     * sends request to api to create a taxon vernacular name
     * @param name - the name to create
     * @returns Observable of response from api casted as `TaxonVernacularListItem`
     * @returns `of(null)` if does not have editing permission or api errors
     */
    create(name: Partial<TaxonVernacularInputDto>): Observable<TaxonVernacularListItem> {

        const url = this.createUrlBuilder().create()
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const query = this.apiClient.queryBuilder(url)
                    .addJwtAuth(token)
                    .post()
                    .body([name])
                    .build()

                return this.apiClient.send(query).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((nameJson) => {
                        if (nameJson === null) {
                            return null
                        }
                        return TaxonVernacularListItem.fromJSON(nameJson);
                    })
                )
            })
        )
    }

    /**
     * sends request to api to update a taxon vernacular record
     * @param name - the name to update
     * @returns Observable of response from api casted as `TaxonVernacularListItem`
     * @returns `of(null)` if name does not exist or does not have editing permission or api errors
     */
    update(name: TaxonVernacularInputDto): Observable<TaxonVernacularListItem> {
        const url = this.createUrlBuilder()
            .upload()
            .id(name.id)
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const req = this.apiClient
                    .queryBuilder(url)
                    .patch()
                    .body([name])
                    .addJwtAuth(token)
                    .build()

                return this.apiClient.send(req).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((nameJson) => {
                        if (nameJson === null) {
                            return null
                        }
                        return TaxonVernacularListItem.fromJSON(nameJson)
                    })
                )
            })
        )

    }

    /**
     * sends request to api to delete a taxon vernacular record
     * @param id - the id of the name to delete
     * @returns Observable of response from api casted as `string`
     * @returns `of(null)` if name does not exist or does not have editing permission or api errors
     */
    delete(id): Observable<string> {
        const url = this.createUrlBuilder()
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

    private createUrlBuilder(): TaxonVernacularQueryBuilder {
        return new TaxonVernacularQueryBuilder(this.appConfig.apiUri());
    }

}
