import { Observable, of } from 'rxjs';
import { AlertService, ApiClientService, AppConfigService, UserService } from '@symbiota2/ui-common';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Taxon, TaxonListItem } from '../../dto';
import { TaxonomicUnitQueryBuilder } from './taxonomicUnit-query-builder';
import { TaxonVernacularListItem } from '../../dto/taxonVernacular-list-item';
import { TaxonInputDto } from '../../dto/taxonInputDto';
import { TaxonQueryBuilder } from '../taxon/taxon-query-builder';
import { TaxonVernacularInputDto } from '../../dto/taxonVernacularInputDto';
import { TaxonomicUnitListItem } from '../../dto/taxonomicUnit-list-item';
import { TaxonomicUnitInputDto } from '../../dto/taxonomicUnitInputDto';

interface FindAllParams {
    IDs: number[]
    limit?: number
}

@Injectable()
export class TaxonomicUnitService {
    private jwtToken = this.user.currentUser.pipe(map((user) => user.token))
    static ranksLookup = new Map()

    constructor(
        private readonly alerts: AlertService,
        private readonly user: UserService,
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService)
    {
        this.findAll().subscribe((units) => {
            units.forEach((unit) => {
                const key = unit.rankID + unit.kingdomName
                TaxonomicUnitService.ranksLookup.set(key,unit.rankName)
            })
        })
    }

    private createQueryBuilder(): TaxonomicUnitQueryBuilder {
        return new TaxonomicUnitQueryBuilder(this.appConfig.apiUri());
    }

    public getRanksLookup() {
        return TaxonomicUnitService.ranksLookup
    }

    /*
    public lookupRankName(rankID, kingdomName) {
        const key = rankID + kingdomName
        console.log("lookup " + key)
        return TaxonomicUnitService.ranksLookup.has(key)?
            TaxonomicUnitService.ranksLookup.get(key)
            : 'unknown'
    }
     */

    public getUrl() {
        const apiBaseUrl = this.appConfig.apiUri()
        const x = new URL(`${apiBaseUrl}/taxonomicUnit`)
        return this.apiClient.apiRoot()
    }

    findAll(params?: FindAllParams): Observable<TaxonomicUnitListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .IDs(params?.IDs)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((units) => units.map((o) => {
                    return TaxonomicUnitListItem.fromJSON(o);
                }))
            )
    }

    findKingdomNames(): Observable<string[]> {
        const url = this.createQueryBuilder()
            .findKingdomNames()
            .build()

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
    }

    findByID(id: number): Observable<TaxonomicUnitListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonomicUnitListItem.fromJSON(o)))
    }

    /**
     * sends request to api to create a taxonomic unit
     * @param unit - the unit to create
     * @returns Observable of response from api casted as `TaxonomicUnitListItem`
     * @returns `of(null)` if does not have editing permission or api errors
     */
    create(unit: Partial<TaxonomicUnitInputDto>): Observable<TaxonomicUnitListItem> {

        const url = this.createUrlBuilder().create()
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const query = this.apiClient.queryBuilder(url)
                    .addJwtAuth(token)
                    .post()
                    .body([unit])
                    .build()

                return this.apiClient.send(query).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((nameJson) => {
                        if (nameJson === null) {
                            return null
                        }
                        return TaxonomicUnitListItem.fromJSON(nameJson);
                    })
                )
            })
        )
    }

    /**
     * sends request to api to update a taxonomic unit
     * @param unit - the unit to update
     * @returns Observable of response from api casted as `TaxonomicUnitListItem`
     * @returns `of(null)` if unit does not exist or does not have editing permission or api errors
     */
    update(name: TaxonomicUnitInputDto): Observable<TaxonomicUnitListItem> {
        const url = this.createUrlBuilder()
            .upload()
            .id(name.id)
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const req = this.apiClient
                    .queryBuilder(url)
                    .patch()
                    .body([name])
                    .addJwtAuth(token)
                    .build()

                return this.apiClient.send(req).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((unitJson) => {
                        if (unitJson === null) {
                            return null
                        }
                        return TaxonomicUnitListItem.fromJSON(unitJson)
                    })
                )
            })
        )
    }

    /**
     * sends request to api to delete a taxonomic unit
     * @param id - the id of the unit to delete
     * @returns Observable of response from api casted as `string`
     * @returns `of(null)` if unit does not exist or does not have editing permission or api errors
     */
    delete(id): Observable<string> {
        const url = this.createUrlBuilder()
            .delete()
            .id(id)
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const req = this.apiClient
                    .queryBuilder(url)
                    .delete()
                    .addJwtAuth(token)
                    .build()

                return this.apiClient.send(req).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((blockJson) => {
                        return "success"
                    })
                )
            })
        )
    }

    private createUrlBuilder(): TaxonomicUnitQueryBuilder {
        return new TaxonomicUnitQueryBuilder(this.appConfig.apiUri());
    }

}
