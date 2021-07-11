import { Observable } from 'rxjs'
import { ApiClientService, AppConfigService } from '@symbiota2/ui-common'
import { map } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import { TaxonDescriptionStatementQueryBuilder } from './taxonDescriptionStatement-query-builder'
import { TaxonDescriptionStatementListItem } from '@symbiota2/ui-plugin-taxonomy';

interface FindAllParams {
    taxonIDs: number[]
    limit?: number
}

@Injectable()
export class TaxonDescriptionStatementService {
    constructor(
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) { }

    private createQueryBuilder(): TaxonDescriptionStatementQueryBuilder {
        return new TaxonDescriptionStatementQueryBuilder(this.appConfig.apiUri());
    }

    public getUrl() {
        const apiBaseUrl = this.appConfig.apiUri()
        const x = new URL(`${apiBaseUrl}/taxonDescriptionStatement`)
        return this.apiClient.apiRoot()
    }

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

    findByID(id: number): Observable<TaxonDescriptionStatementListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonDescriptionStatementListItem.fromJSON(o)))

    }

}
