import { Observable, of } from 'rxjs';
import { ApiClientService, AppConfigService } from '@symbiota2/ui-common';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
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

    findAncestors(tid: number): Observable<TaxonomicEnumTreeListItem[]> {
        const url = this.createQueryBuilder()
            .findAncestors()
            .taxonID(tid)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((taxonenumtree) => taxonenumtree.map((o) => {
                    return TaxonomicEnumTreeListItem.fromJSON(o);
                }))
            )
    }

    findAncestorTaxons(tid: number): Observable<TaxonListItem[]> {
        const url = this.createQueryBuilder()
            .findAncestorTaxons()
            .taxonID(tid)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((taxon) => taxon.map((o) => {
                    return TaxonListItem.fromJSON(o);
                }))
            )
    }

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

    findByID(id: number): Observable<TaxonomicEnumTreeListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonomicEnumTreeListItem.fromJSON(o)))

    }

}
