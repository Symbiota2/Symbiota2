import { Observable, of } from 'rxjs';
import { ApiClientService, AppConfigService } from '@symbiota2/ui-common';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { TaxonomicStatusQueryBuilder } from './taxonomic-status-query-builder';
import { TaxonomicStatusListItem } from '../../dto/taxon-status-list-item';

interface FindParams {
    taxonIDs: number[]
    taxonomicAuthorityID: number
    limit?: number
}

@Injectable()
export class TaxonomicStatusService {
    constructor(
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) { }

    private createQueryBuilder(): TaxonomicStatusQueryBuilder {
        return new TaxonomicStatusQueryBuilder(this.appConfig.apiUri());
    }


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



    /*
    findChildren(tid: number): Observable<TaxonomicStatusListItem> {
        const url = this.createQueryBuilder()
            .findChildren()
            .taxonID(tid)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonomicStatusListItem.fromJSON(o)))
    }

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

    findByID(id: number): Observable<TaxonomicStatusListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonomicStatusListItem.fromJSON(o)))

    }

}
