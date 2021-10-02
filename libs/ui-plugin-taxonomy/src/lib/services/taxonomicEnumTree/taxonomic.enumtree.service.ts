import { Observable, of } from 'rxjs';
import { ApiClientService, AppConfigService } from '@symbiota2/ui-common';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TaxonomicEnumTreeQueryBuilder } from './taxonomic-enumtree-query-builder';
import { TaxonomicEnumTreeListItem } from '../../dto/taxonomic-enumtree-list-item';
import { TaxonListItem } from '../../dto';

interface FindParams {
    taxonID: number
    limit?: number
}

@Injectable()
export class TaxonomicEnumTreeService {
    constructor(
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) { }

    private createQueryBuilder(): TaxonomicEnumTreeQueryBuilder {
        return new TaxonomicEnumTreeQueryBuilder(this.appConfig.apiUri());
    }

    /*
    Find all of the ancestors for a given taxon id and taxa authorityid
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
                map((taxonenumtree) => taxonenumtree.map((o) => {
                    return TaxonomicEnumTreeListItem.fromJSON(o);
                }))
            )
    }

    /*
    Find all of the descendants for a given taxon id and taxa authorityid
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
                map((taxonenumtree) => taxonenumtree.map((o) => {
                    return TaxonomicEnumTreeListItem.fromJSON(o);
                }))
            )
    }

    /*
    Find all of the descendants for a given taxon id and taxa authorityid
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
                map((taxonenumtree) => taxonenumtree.map((o) => {
                    return TaxonomicEnumTreeListItem.fromJSON(o);
                }))
            )
    }

    /*
    Find all of the ancestors for a given taxon id and taxa authorityid as taxon records
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
                map((taxon) => taxon.map((o) => {
                    return TaxonListItem.fromJSON(o);
                }))
            )
    }

    /*
    Find all of the taxa enum records (the API service has a default taxa authority)
     */
    findAll(params?: FindParams): Observable<TaxonomicEnumTreeListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .build();

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((taxonenumtree) => taxonenumtree.map((o) => {
                    return TaxonomicEnumTreeListItem.fromJSON(o);
                }))
            );
    }

    /*
    Find a given taxon enum record, using a taxon id and a taxa authority id
     */
    findByID(id: number, authorityID: number): Observable<TaxonomicEnumTreeListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .authorityID(authorityID)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonomicEnumTreeListItem.fromJSON(o)))

    }

}
