import { Observable, of } from 'rxjs';
import { ApiClientService, AppConfigService } from '@symbiota2/ui-common';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TaxonomicAuthorityQueryBuilder } from './taxonomicAuthority-query-builder';
import { TaxonomicAuthorityListItem } from '../../dto/taxonomicAuthority-list-item';

interface FindAllParams {
    taxonIDs: number[]
    limit?: number
}

@Injectable()
export class TaxonomicAuthorityService {
    currentAuthorityID = null

    constructor(
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) { }

    private createQueryBuilder(): TaxonomicAuthorityQueryBuilder {
        return new TaxonomicAuthorityQueryBuilder(this.appConfig.apiUri());
    }

    public getUrl() {
        const apiBaseUrl = this.appConfig.apiUri()
        const x = new URL(`${apiBaseUrl}/taxonomicAuthority`)
        return this.apiClient.apiRoot()
    }

    setAuthorityID(id) {
        this.currentAuthorityID = id
    }

    getAuthorityID() {
        return this.currentAuthorityID
    }

    findAll(params?: FindAllParams): Observable<TaxonomicAuthorityListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .taxonIDs(params? params.taxonIDs : [])
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((authorities) => authorities.map((o) => {
                    return TaxonomicAuthorityListItem.fromJSON(o);
                }))
            );
    }

    findByID(id: number): Observable<TaxonomicAuthorityListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonomicAuthorityListItem.fromJSON(o)))

    }

}
