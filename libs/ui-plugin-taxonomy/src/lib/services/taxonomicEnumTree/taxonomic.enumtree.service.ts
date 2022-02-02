import { Observable, of } from 'rxjs';
import { AlertService, ApiClientService, AppConfigService, UserService } from '@symbiota2/ui-common';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TaxonomicEnumTreeQueryBuilder } from './taxonomic-enumtree-query-builder';
import { TaxonomicEnumTreeListItem } from '../../dto/taxonomic-enumtree-list-item';
import { TaxonListItem } from '../../dto/taxon-list-item';

interface FindParams {
    taxonID: number
    limit?: number
}

@Injectable()
export class TaxonomicEnumTreeService {
    private jwtToken = this.user.currentUser.pipe(map((user) => user.token))
    private creatorUID = null

    constructor(
        private readonly alerts: AlertService,
        private readonly user: UserService,
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService)
    {
        //Fill in the current user id
        this.user.currentUser.subscribe((user) => {
            if (user) {
                this.creatorUID = user.uid
            }
        })
    }

    private createQueryBuilder(): TaxonomicEnumTreeQueryBuilder {
        return new TaxonomicEnumTreeQueryBuilder(this.appConfig.apiUri());
    }

    /**
     * Find all of the ancestors for a given taxon id and taxa authority id
     * @param tid - the id of the taxon to move
     * @param authorityID - the taxonomic authority under which the find should happen
     * @returns Observable of response from api casted as `TaxonomicEnumTreeListItem[]`
     * will be the enum tree records of the found taxon
     * @returns `of(null)` if taxon id does not exist or api errors
     */
    findAncestors(tid: number, authorityID: number): Observable<TaxonomicEnumTreeListItem[]> {
        const url = this.createQueryBuilder()
            .findAncestors()
            .taxonID(tid)
            .authorityID(authorityID)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                catchError((e) => {
                    console.error(e)
                    return of(null)
                }),
                map((taxonenumtree) => taxonenumtree.map((o) => {
                    return TaxonomicEnumTreeListItem.fromJSON(o);
                }))
            )
    }

    /**
     * Find all of the descendants for a given taxon id and taxa authorityid
     * @param tid - the id of the taxon to move
     * @param authorityID - the taxonomic authority under which the find should happen
     * @returns Observable of response from api casted as `TaxonomicEnumTreeListItem[]`
     * will be the enum tree records of the found descendants
     * @returns `of(null)` if taxon id does not exist or api errors
     */
    findDescendants(tid: number, authorityID: number): Observable<TaxonomicEnumTreeListItem[]> {
        const url = this.createQueryBuilder()
            .findDescendants()
            .taxonID(tid)
            .authorityID(authorityID)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                catchError((e) => {
                    console.error(e)
                    return of(null)
                }),
                map((taxonenumtree) => taxonenumtree.map((o) => {
                    return TaxonomicEnumTreeListItem.fromJSON(o);
                }))
            )
    }

    /**
     * Find all of the descendants for a given taxon id and taxa authority id at a given rank
     * @param tid - the id of the taxon to move
     * @param rankID - the id of the rank to look for
     * @param authorityID - the taxonomic authority under which the find should happen
     * @returns Observable of response from api casted as `TaxonomicEnumTreeListItem[]`
     * will be the enum tree records of the found descendants at this rank
     * @returns `of(null)` if taxon id does not exist or api errors
     */
    findDescendantsByRank(tid: number, rankID: number, authorityID?: number): Observable<TaxonomicEnumTreeListItem[]> {
        const url = this.createQueryBuilder()
            .findDescendantsByRank()
            .taxonID(tid)
            .rankID(rankID)

            if (authorityID) {
                url.authorityID(authorityID)
            }

        const query = this.apiClient.queryBuilder(url.build()).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                catchError((e) => {
                    console.error(e)
                    return of(null)
                }),
                map((taxonenumtree) => taxonenumtree.map((o) => {
                    return TaxonomicEnumTreeListItem.fromJSON(o);
                }))
            )
    }

    /**
     * Find all of the ancestors for a given taxon id and taxa authorityid as taxon records
     * @param tid - the id of the taxon to move
     * @param authorityID - the taxonomic authority under which the find should happen
     * @returns Observable of response from api casted as `TaxonListItem[]`
     * will be the taxon records of the found ancestors
     * @returns `of(null)` if taxon id does not exist or api errors
     */
    findAncestorTaxons(tid: number, authorityID: number): Observable<TaxonListItem[]> {
        const url = this.createQueryBuilder()
            .findAncestorTaxons()
            .taxonID(tid)
            .authorityID(authorityID)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                catchError((e) => {
                    console.error(e)
                    return of(null)
                }),
                map((taxon) => taxon.map((o) => {
                    return TaxonListItem.fromJSON(o);
                }))
            )
    }

    /**
     * Move a taxon id to a new parent taxon id within the context of a taxa authority id
     * @param id - the id of the taxon to move
     * @param parentId - the id of the taxon to move it to (its new parent)
     * @param authorityID - the taxonomic authority under which the move should happen
     * @returns Observable of response from api casted as `TaxonomicEnumTreeListItem`
     * will be the updated enum tree record
     * @returns `of(null)` if taxon id does not exist or does not have editing permission or api errors
     */
    move(id: number, parentId: number, authorityID: number): Observable<TaxonomicEnumTreeListItem> {
        const url = this.createQueryBuilder()
            .move()
            .id(id)
            .parentId(parentId)
            .authorityId(authorityID)
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const req = this.apiClient
                    .queryBuilder(url)
                    .patch()
                    .addJwtAuth(token)
                    .build()

                return this.apiClient.send(req).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((enumJson) => {
                        if (enumJson === null) {
                            return null
                        }
                        return TaxonomicEnumTreeListItem.fromJSON(enumJson);
                    })
                )
            })
        )
    }

}
