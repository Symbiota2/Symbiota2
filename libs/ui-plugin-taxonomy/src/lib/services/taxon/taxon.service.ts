import { Observable, of } from 'rxjs'
import { AlertService, ApiClientService, AppConfigService, UserService } from '@symbiota2/ui-common';
import { catchError, map, switchMap } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import { Taxon  } from '../../dto/taxon'
import { TaxonListItem  } from '../../dto/taxon-list-item'
import { TaxonIDAndNameItem  } from '../../dto/taxon-id-and-name-item'
import { TaxonInputDto  } from '../../dto/taxonInputDto'
import { TaxonIDAuthorNameItem  } from '../../dto/taxon-id-author-name-item'
import { TaxonQueryBuilder } from './taxon-query-builder'

interface FindAllParams {
    taxonIDs: number[]
    limit?: number
}

@Injectable()
export class TaxonService {
    private jwtToken = this.user.currentUser.pipe(map((user) => user.token))

    constructor(
        private readonly alerts: AlertService,
        private readonly user: UserService,
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) { }

    private createQueryBuilder(): TaxonQueryBuilder {
        return new TaxonQueryBuilder(this.appConfig.apiUri())
    }

    public getUrl() {
        return this.apiClient.apiRoot()
    }

    findByScientificName(sciname, authorityID?): Observable<TaxonListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .authorityID(authorityID)
            .scientificName(sciname)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Taxon[]>(query)

    }

    findAllScientificNames(partialName, authorityID?): Observable<TaxonIDAuthorNameItem[]> {
        const qb = this.createQueryBuilder()
            .findAllScientificNames()
            .authorityID(authorityID)
            .partialName(partialName)

        const url = qb.build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, TaxonIDAuthorNameItem[]>(query)
    }

    findAllScientificNamesWithImages(partialName, limit, authorityID?): Observable<TaxonIDAndNameItem[]> {
        const qb = this.createQueryBuilder()
            .findAllScientificNames()
            .limit(limit)
            .withImages()
            .authorityID(authorityID)
            .partialName(partialName)

        const url = qb.build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, TaxonIDAndNameItem[]>(query)
    }

    findScientificNames(partialName, rankID, kingdomName, authorityID?): Observable<TaxonIDAndNameItem[]> {
        const qb = this.createQueryBuilder()
            .findAllScientificNames()
            .rankID(rankID)
            .kingdomName(kingdomName)
            .authorityID(authorityID)
            .partialName(partialName)

        const url = qb.build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, TaxonIDAndNameItem[]>(query)
    }

    findScientificNamesWithImages(partialName, rankID, kingdomName, authorityID?): Observable<TaxonIDAndNameItem[]> {
        const qb = this.createQueryBuilder()
            .findAllScientificNames()
            .rankID(rankID)
            .kingdomName(kingdomName)
            .authorityID(authorityID)
            .withImages()
            .partialName(partialName)

        const url = qb.build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, TaxonIDAndNameItem[]>(query)
    }

    findAll(authorityID?, params?: FindAllParams): Observable<TaxonListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .authorityID(authorityID)
            .taxonIDs(params? params.taxonIDs : [])
            .build();

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((taxons) => taxons.map((o) => {
                    return TaxonListItem.fromJSON(o)
                }))
            )
    }

    findByIDWithSynonyms(id: number, authorityID?): Observable<TaxonListItem> {
        const url = this.createQueryBuilder()
            .findOneWithSynonyms()
            .authorityID(authorityID)
            .id(id)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonListItem.fromJSON(o)))

    }

    findByID(id: number, authorityID?): Observable<TaxonListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .authorityID(authorityID)
            .id(id)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonListItem.fromJSON(o)))

    }

    getProblemUploadRows(): Observable<string[]> {
        const url = this.createQueryBuilder()
            .problemUploadRows()
            .build()

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }

    getProblemAcceptedNames(): Observable<string[]> {
        const url = this.createQueryBuilder()
            .problemAcceptedNames()
            .build()

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }

    getProblemParentNames(): Observable<string[]> {
        const url = this.createQueryBuilder()
            .problemParentNames()
            .build()

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }

    getProblemRanks(): Observable<string[]> {
        const url = this.createQueryBuilder()
            .problemRanks()
            .build()

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }

    /**
     * sends request to api to create a taxon record
     * @param taxon - the taxon to create
     * @returns Observable of response from api casted as `TaxonListItem`
     * will be the created taxon
     * @returns `of(null)` if does not have editing permission or api errors
     */
    create(taxon: Partial<TaxonInputDto>): Observable<TaxonListItem> {

        const url = this.createQueryBuilder().create()
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const query = this.apiClient.queryBuilder(url)
                    .addJwtAuth(token)
                    .post()
                    .body([taxon])
                    .build()

                return this.apiClient.send(query).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((taxonJson) => {
                        if (taxonJson === null) {
                            return null
                        }
                        return TaxonListItem.fromJSON(taxonJson);
                    })
                )
            })
        )
    }

    /**
     * sends request to api to update a taxon record
     * @param taxon - the taxon to update
     * @returns Observable of response from api casted as `TaxonListItem`
     * will be the updated taxon
     * @returns `of(null)` if taxon does not exist or does not have editing permission or api errors
     */
    update(taxon: TaxonInputDto): Observable<TaxonListItem> {
        const url = this.createQueryBuilder()
            .upload()
            .id(taxon.id)
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const req = this.apiClient
                    .queryBuilder(url)
                    .patch()
                    .body([taxon])
                    .addJwtAuth(token)
                    .build()

                return this.apiClient.send(req).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((taxonJson) => {
                        if (taxonJson === null) {
                            return null
                        }
                        return TaxonListItem.fromJSON(taxonJson)
                    })
                )
            })
        )

    }

    /**
     * sends request to api to delete a taxon record
     * @param id - the id of the taxon to delete
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
