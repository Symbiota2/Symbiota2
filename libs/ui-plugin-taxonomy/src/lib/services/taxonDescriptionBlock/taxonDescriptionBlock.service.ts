import { Observable, of } from 'rxjs';
import { AlertService, ApiClientService, AppConfigService, UserService } from '@symbiota2/ui-common';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core'
import { TaxonDescriptionBlockQueryBuilder } from './taxonDescriptionBlock-query-builder'
import { TaxonDescriptionBlockListItem } from '../../dto/taxonDescriptionBlock-list-item'
import { TaxonDescriptionBlockInputDto } from '../../dto';
import { CollectionRoleOutput } from '../../../../../ui-plugin-collection/src/lib/dto/CollectionRole.dto';


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

    public getUrl() {
        const apiBaseUrl = this.appConfig.apiUri()
        const x = new URL(`${apiBaseUrl}/taxonDescriptionBlock`)
        return this.apiClient.apiRoot()
    }

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

    findByID(id: number): Observable<TaxonDescriptionBlockListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonDescriptionBlockListItem.fromJSON(o)))

    }

    create(block: Partial<TaxonDescriptionBlockInputDto>): Observable<TaxonDescriptionBlockListItem> {

        console.log(" id is " + block.taxonID)
        block.creatorUID = this.creatorUID
        const url = this.createUrlBuilder().create()
            .build()

        //return this.jwtToken.pipe(
        //switchMap((token) => {
        console.log("here " + block.creatorUID + block.taxonID)
        const query = this.apiClient.queryBuilder(url)
            //.addJwtAuth(token)
            .post()
            .body([block])
            .build()

        console.log("here2 " + query.method + query.urlWithParams)
        return this.apiClient.send(query).pipe(
            catchError((e) => {
                console.log(" error ")
                console.error(e)
                return of(null)
            }),
            map((blockJson) => {
                console.log(" mapping " + blockJson)
                if (blockJson === null) {
                    return null
                }
                return TaxonDescriptionBlockListItem.fromJSON(blockJson);
            })
        )
        console.log("no pipe ")
        //})
        //)
    }

    update(block: TaxonDescriptionBlockListItem): Observable<TaxonDescriptionBlockListItem> {
        const url = this.createUrlBuilder().upload()
            .build()

        const req = this.apiClient
            .queryBuilder(url)
            .patch()
            .queryParam("id", block.id.toString())
            .body(block)
            //.addJwtAuth(userToken)
            .build()

        return this.apiClient.send(req).pipe(
            catchError((e) => {
                console.log(" error ")
                console.error(e)
                return of(null)
            }),
            map((blockJson) => {
                console.log(" mapping ")
                if (blockJson === null) {
                    return null
                }
                return TaxonDescriptionBlockListItem.fromJSON(blockJson);
            })
        )
    }

    /**
     * sends request to api to delete a taxon description block
     * @param block - the block to delete, it should be just the block id that is needed
     * @returns Observable of response from api casted as `TaxonDescriptionBlockListItem`.
     * will be the deleted block or null if api has errors
     * @returns `of(null)` if user does not exist or does not have editing permission.
     */

    delete(block: Partial<TaxonDescriptionBlockInputDto>): Observable<TaxonDescriptionBlockListItem> {
        const url = this.createUrlBuilder()
            .build()

        const req = this.apiClient
            .queryBuilder(url)
            .delete()
            .queryParam("id", block.id.toString())
            .body(block)
            //.addJwtAuth(userToken)
            .build()

        return this.apiClient.send(req).pipe(
            catchError((e) => {
                console.log(" error ")
                console.error(e)
                return of(null)
            }),
            map((blockJson) => {
                console.log(" mapping ")
                if (blockJson === null) {
                    return null
                }
                return TaxonDescriptionBlockListItem.fromJSON(blockJson);
            })
        )

        /*
        return this.user.currentUser.pipe(
            switchMap((currentUser) => {
                if (!!currentUser) {
                        switchMap((collection) => {
                            if (currentUser.canEditCollection(collection.id)) {
                                //const url = `${this.COLLECTION_BASE_URL}/${collection.id}/roles`;
                                const req = this.api
                                    .queryBuilder(url)
                                    .delete()
                                    .body([block])
                                    .addJwtAuth(currentUser.token)
                                    .build();

                                return this.api.send(req).pipe(
                                    map((response: CollectionRoleOutput) => {
                                        return response;
                                    })
                                )
                            } else {
                                this.alertService.showError(`User does not have permission to delete taxon block`)
                                return null
                            }
                        }
                } else {
                    this.alertService.showError(
                        `User must be logged in to delete taxon block`
                    )
                    return null
                }
            }
        )
         */
    }


    private createUrlBuilder(): TaxonDescriptionBlockQueryBuilder {
        return new TaxonDescriptionBlockQueryBuilder(this.appConfig.apiUri());
    }
}
