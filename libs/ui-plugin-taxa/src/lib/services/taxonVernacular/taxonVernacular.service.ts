import { Observable, of } from 'rxjs';
import { ApiClientService, AppConfigService } from '@symbiota2/ui-common';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Taxon, TaxonListItem } from '../../dto';
import { TaxonVernacularQueryBuilder } from './taxonVernacular-query-builder';
import { TaxonVernacularListItem } from '../../dto/taxonVernacular-list-item';

interface FindAllParams {
    taxonIDs: number[]
    limit?: number
}

@Injectable()
export class TaxonVernacularService {
    constructor(
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) { }

    private createQueryBuilder(): TaxonVernacularQueryBuilder {
        return new TaxonVernacularQueryBuilder(this.appConfig.apiUri());
    }

    public getUrl() {
        const apiBaseUrl = this.appConfig.apiUri()
        const x = new URL(`${apiBaseUrl}/taxonVernacular`)
        return this.apiClient.apiRoot()
    }

    /*
    findCommonName(name): Observable<TaxonListItem> {
        const url = this.createQueryBuilder()
            .findScientificName()
            .scientificName(sciname)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => Taxon.fromJSON(o)))
    }

     */

    findCommonName(name: string): Observable<TaxonVernacularListItem> {
        const url = this.createQueryBuilder()
            .findCommonName(name)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, TaxonVernacularListItem>(query)
    }

    findAllCommonNamesByLanguage(language: string): Observable<string[]> {
        const url = this.createQueryBuilder()
            .findAllCommonNamesByLanguage(language)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }

    findAllCommonNames(): Observable<string[]> {
        const url = this.createQueryBuilder()
            .findAllCommonNames()
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }

    findAllLanguages(): Observable<string[]> {
        const url = this.createQueryBuilder()
            .findAllLanguages()
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }

    findAll(params?: FindAllParams): Observable<TaxonVernacularListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .taxonIDs(params.taxonIDs)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((taxons) => taxons.map((o) => {
                    return TaxonVernacularListItem.fromJSON(o);
                }))
            );
    }

    findByID(id: number): Observable<Taxon> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => Taxon.fromJSON(o)))

    }

}
