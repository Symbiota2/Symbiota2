import { Observable } from 'rxjs'
import { ApiClientService, AppConfigService } from '@symbiota2/ui-common'
import { map } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import { TaxonDescriptionBlockQueryBuilder } from './taxonDescriptionBlock-query-builder'
import { TaxonDescriptionBlockListItem } from '../../dto/taxonDescriptionBlock-list-item'

interface FindAllParams {
    taxonIDs: number[]
    limit?: number
}

@Injectable()
export class TaxonDescriptionBlockService {
    constructor(
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) { }

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

    findBlockByTaxonID(tid): Observable<TaxonDescriptionBlockListItem> {
        const url = this.createQueryBuilder()
            .findBlockByTaxonID(tid)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonDescriptionBlockListItem.fromJSON(o)))
    }

    findByID(id: number): Observable<TaxonDescriptionBlockListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonDescriptionBlockListItem.fromJSON(o)))

    }

}
