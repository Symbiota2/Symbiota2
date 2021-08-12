import { Observable, of } from 'rxjs';
import { ApiClientService, AppConfigService } from '@symbiota2/ui-common';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Taxon, TaxonListItem } from '../../dto';
import { TaxonVernacularQueryBuilder } from './taxonVernacular-query-builder';
import { TaxonVernacularListItem } from '../../dto/taxonVernacular-list-item';

interface FindAllParams {
    IDs: number[]
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

    findCommonName(name: string, authorityID?: number): Observable<TaxonVernacularListItem> {
        const url = this.createQueryBuilder()
            .findCommonName(name)
            .authorityID(authorityID)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, TaxonVernacularListItem>(query)
    }

    findAllCommonNamesByLanguage(language: string, partialName: string, authorityID?: number): Observable<string[]> {
        const url = this.createQueryBuilder()
            .findAllCommonNamesByLanguage(language)
            .authorityID(authorityID)
            .partialName(partialName)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }

    findAllCommonNames(partialName: string, authorityID?: number): Observable<string[]> {
        const url = this.createQueryBuilder()
            .findAllCommonNames()
            .authorityID(authorityID)
            .partialName(partialName)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }

    findAllLanguages(authorityID?: number): Observable<string[]> {
        const url = this.createQueryBuilder()
            .findAllLanguages()
            .authorityID(authorityID)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }

    findAll(authorityID?: number, params?: FindAllParams): Observable<TaxonVernacularListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .IDs(params?.IDs)
            .authorityID(authorityID)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((taxons) => taxons.map((o) => {
                    return TaxonVernacularListItem.fromJSON(o);
                }))
            );
    }

    findByTaxonID(taxonID: number): Observable<TaxonVernacularListItem[]> {
        const url = this.createQueryBuilder()
            .findByTaxonID(taxonID)
            .build()

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
