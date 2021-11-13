import { Observable, of } from 'rxjs';
import { AlertService, ApiClientService, AppConfigService, UserService } from '@symbiota2/ui-common';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core'
import { TaxonDescriptionBlockQueryBuilder } from './taxonDescriptionBlock-query-builder'
import { TaxonDescriptionBlockListItem } from '../../dto/taxonDescriptionBlock-list-item'
import { TaxonDescriptionBlockInputDto } from '../../dto'


interface FindAllParams {
    taxonIDs: number[]
    limit?: number
}

@Injectable()
export class TaxonDescriptionBlockService {
    private jwtToken = this.user.currentUser.pipe(map((user) => user.token))
    private creatorUID = null

    constructor(
        private readonly alerts: AlertService,
        private readonly user: UserService,
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) {

        //Fill in the current user id
        this.user.currentUser.subscribe((user) => {
            if (user) {
                this.creatorUID = user.uid
            }
        })
    }

    private createQueryBuilder(): TaxonDescriptionBlockQueryBuilder {
        return new TaxonDescriptionBlockQueryBuilder(this.appConfig.apiUri());
    }

    /**
     * fetches the base url for the api
     * @returns url of the api
     */
    public getUrl() {
        //const apiBaseUrl = this.appConfig.apiUri()
        //const x = new URL(`${apiBaseUrl}/taxonDescriptionBlock`)
        return this.apiClient.apiRoot()
    }

    /**
     * sends request to api to find all of the taxon description blocks
     * @param params? - could be null, but the query params include the limit, offset, and
     * list of taxon ids.
     * @returns Observable of response from api casted as `TaxonDescriptionBlockListItem[]`
     * will be the found blocks
     * @returns `of(null)` if api errors
     * @returns [] if no such blocks
     */
    findAll(params?: FindAllParams): Observable<TaxonDescriptionBlockListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .taxonIDs(params? params.taxonIDs : [])
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return TaxonDescriptionBlockListItem.fromJSON(o);
                }))
            );
    }

    /**
     * sends request to api to find a taxon description blocks using a taxpm id
     * @param tid - the taxon id
     * @returns Observable of response from api casted as `TaxonDescriptionBlockListItem`.
     * will be the found block
     * @returns `of(null)` if block does not exist or api has errors
     */
    findBlocksByTaxonID(tid): Observable<TaxonDescriptionBlockListItem[]> {
        const url = this.createQueryBuilder()
            .findBlocksByTaxonID(tid)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return TaxonDescriptionBlockListItem.fromJSON(o)
                }))
            )
    }

    /**
     * sends request to api to find a taxon description block using the block's id
     * @param block - the block's id
     * @returns Observable of response from api casted as `TaxonDescriptionBlockListItem`.
     * will be the found block or null if api has errors or block not found
     * @returns `of(null)` if block does not exist
     */
    findByID(id: number): Observable<TaxonDescriptionBlockListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonDescriptionBlockListItem.fromJSON(o)))

    }

    /**
     * sends request to api to create a taxon description block
     * @param block - the block to create
     * @returns Observable of response from api casted as `TaxonDescriptionBlockListItem`
     * will be the created block
     * @returns `of(null)` if does not have editing permission or api errors
     */
    create(block: Partial<TaxonDescriptionBlockInputDto>): Observable<TaxonDescriptionBlockListItem> {

        block.creatorUID = this.creatorUID
        const url = this.createUrlBuilder().create()
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const query = this.apiClient.queryBuilder(url)
                    .addJwtAuth(token)
                    .post()
                    .body([block])
                    .build()

                return this.apiClient.send(query).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((blockJson) => {
                        if (blockJson === null) {
                            return null
                        }
                        return TaxonDescriptionBlockListItem.fromJSON(blockJson);
                    })
                )
            })
        )
    }

    /**
     * sends request to api to update a taxon description block
     * @param block - the block to update
     * @returns Observable of response from api casted as `TaxonDescriptionBlockListItem`
     * will be the updated block
     * @returns `of(null)` if block does not exist or does not have editing permission or api errors
     */
    update(block: TaxonDescriptionBlockInputDto): Observable<TaxonDescriptionBlockListItem> {
        const url = this.createUrlBuilder()
            .upload()
            .id(block.id)
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const req = this.apiClient
                    .queryBuilder(url)
                    .patch()
                    .body([block])
                    .addJwtAuth(token)
                    .build()

                return this.apiClient.send(req).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((blockJson) => {
                        if (blockJson === null) {
                            return null
                        }
                        return TaxonDescriptionBlockListItem.fromJSON(blockJson);
                    })
                )
            })
        )

    }

    /**
     * sends request to api to delete a taxon description block
     * @param id - the id of the block to delete
     * @returns Observable of response from api casted as `string`
     * @returns `of(null)` if block does not exist or does not have editing permission or api errors
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
                        /*  //API returns null on success so return something else to signal "success"
                        if (blockJson === null) {
                            return null
                        }
                        return TaxonDescriptionBlockListItem.fromJSON(blockJson)
                         */
                    })
                )
            })
        )
    }

    private createUrlBuilder(): TaxonDescriptionBlockQueryBuilder {
        return new TaxonDescriptionBlockQueryBuilder(this.appConfig.apiUri());
    }
}
