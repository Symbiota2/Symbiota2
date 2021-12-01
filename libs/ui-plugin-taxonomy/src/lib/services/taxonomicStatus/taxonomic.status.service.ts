import { Observable, of } from 'rxjs';
import { AlertService, ApiClientService, AppConfigService, UserService } from '@symbiota2/ui-common';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TaxonomicStatusQueryBuilder } from './taxonomic-status-query-builder';
import { TaxonomicStatusListItem } from '../../dto/taxon-status-list-item';
import { TaxonomicStatusOnlyListItem } from '../../dto/taxon-status-only-list-item';
import { TaxonDescriptionBlockInputDto, TaxonDescriptionBlockListItem } from '../../dto';
import { TaxonDescriptionBlockQueryBuilder } from '../taxonDescriptionBlock/taxonDescriptionBlock-query-builder';
import { TaxonomicStatusInputDto } from '../../../../../api-plugin-taxonomy/src/taxonomicStatus/dto/TaxonomicStatusInputDto';

interface FindParams {
    taxonIDs: number[]
    taxonomicAuthorityID: number
    limit?: number
}

@Injectable()
export class TaxonomicStatusService {
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

    private createQueryBuilder(): TaxonomicStatusQueryBuilder {
        return new TaxonomicStatusQueryBuilder(this.appConfig.apiUri())
    }

    /**
     * sends request to api to find all of the synonyms of a given taxon
     * @param tid - taxon id to look for synonyms of
     * @param taxonomicAuthorityID - the authority ID
     * @returns Observable of response from api casted as `TaxonomicStatusOnlyListItem[]`
     * will be the found statuses
     * @returns `of(null)` if api errors
     * @returns [] if no synonyms
     */
    findSynonyms(tid: number, taxonomicAuthorityID: number): Observable<TaxonomicStatusOnlyListItem[]> {
        const url = this.createQueryBuilder()
            .taxonomicAuthorityID(taxonomicAuthorityID)
            .findSynonyms()
            .taxonID(tid)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((taxonstatus) => taxonstatus.map((o) => {
                    return TaxonomicStatusListItem.fromJSON(o);
                }))
            )
    }

    /**
     * sends request to api to find all of the children taxonomic statuses of a given taxon
     * @param tid - taxon id to look for children of
     * @param taxonomicAuthorityID - the authority ID
     * @returns Observable of response from api casted as `TaxonomicStatusListItem[]`
     * will be the found statuses
     * @returns `of(null)` if api errors
     * @returns [] if no children
     */
    findChildren(tid: number, taxonomicAuthorityID: number): Observable<TaxonomicStatusListItem[]> {
        const url = this.createQueryBuilder()
            .taxonomicAuthorityID(taxonomicAuthorityID)
            .findChildren()
            .taxonID(tid)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((taxonstatus) => taxonstatus.map((o) => {
                    return TaxonomicStatusListItem.fromJSON(o);
                }))
            )
    }

    /**
     * sends request to api to find all of the taxonomic statuses
     * @param params? - could be null, but the query params include the limit, offset, and
     * list of taxon ids.
     * @returns Observable of response from api casted as `TaxonomicStatusListItem[]`
     * will be the found statuses
     * @returns `of(null)` if api errors
     * @returns [] if no such statuses
     */
    findAll(params?: FindParams): Observable<TaxonomicStatusListItem[]> {
        const url = this.createQueryBuilder()
            .taxonomicAuthorityID(params? params.taxonomicAuthorityID : null)
            .findAll()
            .taxonIDs(params? params.taxonIDs : [])
            .build();

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((taxonstatus) => taxonstatus.map((o) => {
                    return TaxonomicStatusListItem.fromJSON(o);
                }))
            );
    }

    /**
     * sends request to api to find a taxonomic statuses of a given taxon
     * @param tid - taxon id to look for children of
     * @param taxonomicAuthorityID - the authority ID
     * @returns Observable of response from api casted as `TaxonomicStatusListItem[]`
     * will be the found statuses
     * @returns `of(null)` if api errors
     * @returns [] if no children
     */
    findByID(id: number, taxonAuthorityID: number, taxonIDAccepted: number ): Observable<TaxonomicStatusListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .authorityId(taxonAuthorityID)
            .acceptedId(taxonIDAccepted)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonomicStatusListItem.fromJSON(o)))

    }

    /**
     * sends request to api to create a taxonomic status
     * @param status - the status to create
     * @returns Observable of response from api casted as `TaxonomicStatusOnlyListItem`
     * will be the created status
     * @returns `of(null)` if does not have editing permission or api errors
     */
    create(status: Partial<TaxonomicStatusInputDto>): Observable<TaxonomicStatusOnlyListItem> {

        // status.creatorUID = this.creatorUID
        const url = this.createUrlBuilder().create()
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const query = this.apiClient.queryBuilder(url)
                    .addJwtAuth(token)
                    .post()
                    .body([status])
                    .build()

                return this.apiClient.send(query).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((statusJson) => {
                        if (statusJson === null) {
                            return null
                        }
                        return TaxonomicStatusOnlyListItem.fromJSON(statusJson);
                    })
                )
            })
        )
    }

    /**
     * sends request to api to update a taxon status
     * @param status - the status to update
     * @returns Observable of response from api casted as `TaxonomicStatusOnlyListItem`
     * will be the updated status
     * @returns `of(null)` if status does not exist or does not have editing permission or api errors
     */
    update(status: TaxonomicStatusInputDto): Observable<TaxonomicStatusOnlyListItem> {
        const url = this.createUrlBuilder()
            .upload()
            .id(status.taxonID)
            .authorityId(status.taxonAuthorityID)
            .acceptedId(status.taxonIDAccepted)
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const req = this.apiClient
                    .queryBuilder(url)
                    .patch()
                    .body([status])
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
                        return TaxonomicStatusOnlyListItem.fromJSON(blockJson);
                    })
                )
            })
        )
    }

    /**
     * sends request to api to change a taxon's status to accepted  (without making any other changes)
     * @param taxonID - the taxonID of the newly accepted taxon
     * @param taxonomicAuthorityID - the authority ID
     * @returns Observable of response from api casted as `TaxonomicStatusOnlyListItem`
     * will be the updated status of the newly accepted taxon
     * @returns `of(null)` if status does not exist or does not have editing permission or api errors
     */
    updateToAccepted(taxonID, taxonomicAuthorityID): Observable<TaxonomicStatusOnlyListItem> {
        const url = this.createUrlBuilder()
            .upload()
            .toAccepted(taxonID, taxonomicAuthorityID)
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const req = this.apiClient
                    .queryBuilder(url)
                    .patch()
                    .body([status])
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
                        return TaxonomicStatusOnlyListItem.fromJSON(blockJson);
                    })
                )
            })
        )
    }

    /**
     * sends request to api to change a taxon status to accepted and the accepted to not accepted (also have to
     * update all of the synonyms)
     * @param newTaxonID - the taxonID of the newly accepted taxon
     * @param taxonomicAuthorityID - the authority ID
     * @param oldTaxonID - the taxonID of the previously accepted taxon
     * @returns Observable of response from api casted as `TaxonomicStatusOnlyListItem`
     * will be the updated status of the newly accepted taxon
     * @returns `of(null)` if status does not exist or does not have editing permission or api errors
     */
    updateAcceptedRing(newTaxonID, taxonomicAuthorityID, oldTaxonID): Observable<TaxonomicStatusOnlyListItem> {
        const url = this.createUrlBuilder()
            .upload()
            .acceptedRing(newTaxonID, taxonomicAuthorityID, oldTaxonID)
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const req = this.apiClient
                    .queryBuilder(url)
                    .patch()
                    .body([status])
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
                        return TaxonomicStatusOnlyListItem.fromJSON(blockJson);
                    })
                )
            })
        )
    }

    /**
     * sends request to api to delete a taxon status
     * @param id - the id of the taxon
     * @param taxonAuthorityID - the taxonomic authority id
     * @param taxonIDAccepted - the accepted taxon idt
     * @returns Observable of response from api casted as `string`
     * @returns `of(null)` if block does not exist or does not have editing permission or api errors
     */
    delete(id,taxonAuthorityID,taxonIDAccepted): Observable<string> {
        const url = this.createUrlBuilder()
            .delete()
            .id(id)
            .authorityId(taxonAuthorityID)
            .acceptedId(taxonIDAccepted)
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

    private createUrlBuilder(): TaxonomicStatusQueryBuilder {
        return new TaxonomicStatusQueryBuilder(this.appConfig.apiUri());
    }

}
