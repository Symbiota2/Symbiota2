import { Observable, of } from 'rxjs'
import { ApiClientService, AppConfigService } from '@symbiota2/ui-common'
import { catchError, map } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import { Taxon, TaxonListItem } from '../../dto'
import { TaxonQueryBuilder } from './taxon-query-builder'
import { TaxonIDAndNameItem } from '../../dto/taxon-id-and-name-item';

interface FindAllParams {
    taxonIDs: number[]
    limit?: number
}

@Injectable()
export class TaxonService {
    constructor(
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) { }

    private createQueryBuilder(): TaxonQueryBuilder {
        return new TaxonQueryBuilder(this.appConfig.apiUri());
    }

    public getUrl() {
        const apiBaseUrl = this.appConfig.apiUri()
        const x = new URL(`${apiBaseUrl}/taxon/scientificNames`)
        return this.apiClient.apiRoot()
    }

    findScientificName(sciname, authorityID?): Observable<TaxonListItem> {
        const url = this.createQueryBuilder()
            .findScientificName()
            .authorityID(authorityID)
            .scientificName(sciname)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => Taxon.fromJSON(o)))
    }

    findAllScientificNames(partialName, authorityID?): Observable<string[]> {
        const qb = this.createQueryBuilder()
            .findAllScientificNames()
            .authorityID(authorityID)
            .partialName(partialName)

        const url = qb.build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }

    findScientificNames(partialName, rank, authorityID?): Observable<TaxonIDAndNameItem[]> {
        const qb = this.createQueryBuilder()
            .findAllScientificNames()
            .authorityID(authorityID)
            .partialName(partialName)

        if (rank) {
            if (rank == "family") {
                qb.familyRank()
            } else if (rank == "species") {
                qb.speciesRank()
            } else if (rank == "genus") {
                qb.genusRank()
            }
        } else {
            qb.familyRank()  // Default to family rank
        }

        const url = qb.build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, TaxonIDAndNameItem[]>(query)
    }

    findAllScientificNamesPlusAuthors(partialName, authorityID?): Observable<string[]> {
        const url = this.createQueryBuilder()
            .findAllScientificNamesPlusAuthors()
            .authorityID(authorityID)
            .partialName(partialName)
            .build()
        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }

    findAll(authorityID?, params?: FindAllParams): Observable<TaxonListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .authorityID(authorityID)
            .taxonIDs(params? params.taxonIDs : [])
            .build();

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((taxons) => taxons.map((o) => {
                    return TaxonListItem.fromJSON(o)
                }))
            )
    }

    findByID(id: number, authorityID?): Observable<TaxonListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .authorityID(authorityID)
            .id(id)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonListItem.fromJSON(o)))

    }

}
