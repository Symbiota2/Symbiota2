import { Observable, of } from 'rxjs';
import { AlertService, ApiClientService, AppConfigService, UserService } from '@symbiota2/ui-common';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core'
import { TaxonDescriptionStatementQueryBuilder } from './taxonDescriptionStatement-query-builder'
import {
    TaxonDescriptionBlockInputDto,
    TaxonDescriptionBlockListItem,
    TaxonDescriptionStatementListItem
} from '@symbiota2/ui-plugin-taxonomy';
import { TaxonDescriptionStatementInputDto } from '../../dto/taxonDescriptionStatementInputDto';
import { TaxonDescriptionBlockQueryBuilder } from '../taxonDescriptionBlock/taxonDescriptionBlock-query-builder';

interface FindAllParams {
    taxonIDs: number[]
    limit?: number
}

@Injectable()
export class TaxonDescriptionStatementService {
    private jwtToken = this.user.currentUser.pipe(map((user) => user.token))

    constructor(
        private readonly alerts: AlertService,
        private readonly user: UserService,
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) {

    }

    private createQueryBuilder(): TaxonDescriptionStatementQueryBuilder {
        return new TaxonDescriptionStatementQueryBuilder(this.appConfig.apiUri());
    }

    public getUrl() {
        const apiBaseUrl = this.appConfig.apiUri()
        const x = new URL(`${apiBaseUrl}/taxonDescriptionStatement`)
        return this.apiClient.apiRoot()
    }

    /**
     * sends request to api to find all of the taxon description statements
     * @param params? - could be null, but the query params include the limit, offset, and
     * list of taxon ids.
     * @returns Observable of response from api casted as `TaxonDescriptionStatementListItem[]`.
     * will be the found statements
     * @returns `of(null)` if api errors
     * @returns [] if no such statements
     */
    findAll(params?: FindAllParams): Observable<TaxonDescriptionStatementListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .taxonIDs(params? params.taxonIDs : [])
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return TaxonDescriptionStatementListItem.fromJSON(o);
                }))
            );
    }

    /**
     * sends request to api to find a taxon description statements using a tid
     * @param tid - the taxon id
     * @returns Observable of response from api casted as `TaxonDescriptionStatementListItem[]`
     * will be the found statements
     * @returns `of(null)` if block does not exist or api has errors
     */
    findDescriptions(tid): Observable<TaxonDescriptionStatementListItem[]> {
        const url = this.createQueryBuilder()
            .findDescriptions()
            .taxonIDs([tid])
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return TaxonDescriptionStatementListItem.fromJSON(o);
                }))
            );
    }

    /**
     * sends request to api to find a taxon description statements using an id
     * @param id - the taxon description statement id
     * @returns Observable of response from api casted as `TaxonDescriptionStatementListItem`
     * will be the found statement
     * @returns `of(null)` if block does not exist or api has errors
     */
    findByID(id: number): Observable<TaxonDescriptionStatementListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonDescriptionStatementListItem.fromJSON(o)))

    }

    /**
     * sends request to api to create a taxon description statement
     * @param statement - the statement to create
     * @returns Observable of response from api casted as `TaxonDescriptionStatementListItem`
     * will be the created statement
     * @returns `of(null)` if statement does not exist or does not have editing permission or api errors
     */
    create(statement: Partial<TaxonDescriptionStatementInputDto>): Observable<TaxonDescriptionStatementListItem> {

        const url = this.createUrlBuilder().create()
            .build()

        //return this.jwtToken.pipe(
        //switchMap((token) => {

        const query = this.apiClient.queryBuilder(url)
            //.addJwtAuth(token)
            .post()
            .body([statement])
            .build()

        return this.apiClient.send(query).pipe(
            catchError((e) => {
                console.log(" error ")
                console.error(e)
                return of(null)
            }),
            map((statementJson) => {
                if (statementJson === null) {
                    return null
                }
                return TaxonDescriptionStatementListItem.fromJSON(statementJson);
            })
        )
    }

    /**
     * sends request to api to update a taxon description statement
     * @param statement - the statement to update
     * @returns Observable of response from api casted as `TaxonDescriptionStatementListItem`
     * will be the updated block
     * @returns `of(null)` if block does not exist or does not have editing permission or api errors
     */
    update(statement: TaxonDescriptionStatementListItem): Observable<TaxonDescriptionStatementListItem> {
        const url = this.createUrlBuilder().upload()
            .build()

        const req = this.apiClient
            .queryBuilder(url)
            .patch()
            .queryParam("id", statement.id.toString())
            .body(statement)
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
                return TaxonDescriptionStatementListItem.fromJSON(blockJson)
            })
        )
    }

    /**
     * sends request to api to delete a taxon description statement
     * @param id - the id of the statement to delete
     * @returns Observable of response from api casted as `TaxonDescriptionStatementListItem`
     * will be the deleted statement
     * @returns `of(null)` if user does not exist or does not have editing permission or api errors
     */
    delete(id): Observable<TaxonDescriptionStatementListItem> {
        const url = this.createUrlBuilder()
            .delete()
            .id(id)
            .build()

        const req = this.apiClient
            .queryBuilder(url)
            .delete()
            //.queryParam("id", id.toString())
            //.body(block)
            //.addJwtAuth(userToken)
            .build()

        return this.apiClient.send(req).pipe(
            catchError((e) => {
                console.log(" error ")
                console.error(e)
                return of(null)
            }),
            map((statementJson) => {
                console.log(" mapping ")
                if (statementJson === null) {
                    return null
                }
                return TaxonDescriptionStatementListItem.fromJSON(statementJson)
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

    private createUrlBuilder(): TaxonDescriptionStatementQueryBuilder {
        return new TaxonDescriptionStatementQueryBuilder(this.appConfig.apiUri());
    }

}
