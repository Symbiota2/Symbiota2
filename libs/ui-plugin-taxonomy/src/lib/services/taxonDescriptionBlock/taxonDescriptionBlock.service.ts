import { Observable, of } from 'rxjs';
import { AlertService, ApiClientService, AppConfigService, UserService } from '@symbiota2/ui-common';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core'
import { TaxonDescriptionBlockQueryBuilder } from './taxonDescriptionBlock-query-builder'
import { TaxonDescriptionBlockListItem } from '../../dto/taxonDescriptionBlock-list-item'
import { ApiCollectionOutput, ApiOccurrence } from '@symbiota2/data-access';
import { Occurrence } from '@symbiota2/ui-plugin-occurrence';
import { OccurrenceQueryBuilder } from '../../../../../ui-plugin-occurrence/src/lib/services/occurrence-query-builder';
import { CollectionInputDto } from '../../../../../ui-plugin-collection/src/lib/dto/Collection.input.dto';
import { Collection } from '@symbiota2/ui-plugin-collection';
import { TaxonDescriptionBlockInputDto } from '../../../../../api-plugin-taxonomy/src/taxonDescriptionBlock/dto/TaxonDescriptionBlockInputDto';

interface FindAllParams {
    taxonIDs: number[]
    limit?: number
}

@Injectable()
export class TaxonDescriptionBlockService {
    private jwtToken = this.user.currentUser.pipe(map((user) => user.token))
    private creatorUID = null

    constructor(
        private readonly alerts: AlertService,
        private readonly user: UserService,
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) {

        //Fill in the current user id
        this.user.currentUser.subscribe((user) => {
            if (user) {
                this.creatorUID = user.uid
            }
        })
    }

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

    findBlocksByTaxonID(tid): Observable<TaxonDescriptionBlockListItem[]> {
        const url = this.createQueryBuilder()
            .findBlocksByTaxonID(tid)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return TaxonDescriptionBlockListItem.fromJSON(o)
                }))
            )
    }

    findByID(id: number): Observable<TaxonDescriptionBlockListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => TaxonDescriptionBlockListItem.fromJSON(o)))

    }

    create(block: Partial<TaxonDescriptionBlockListItem>): Observable<TaxonDescriptionBlockListItem> {

        block.creatorUID = this.creatorUID
        const url = this.createUrlBuilder().create()
            .build()

        //return this.jwtToken.pipe(
        //switchMap((token) => {
        console.log("here ")
        const query = this.apiClient.queryBuilder(url)
            //.addJwtAuth(token)
            .post()
            .body([block])
            .build()

        console.log("here2 " + query.method + query.urlWithParams)
        return this.apiClient.send(query).pipe(
            catchError((e) => {
                console.log(" error ")
                console.error(e)
                return of(null)
            }),
            map((blockJson) => {
                console.log(" mapping ")
                if (blockJson === null) {
                    return null
                }
                return TaxonDescriptionBlockListItem.fromJSON(blockJson);
            })
        )
        console.log("no pipe ")
        //})
        //)
    }

    update(block: TaxonDescriptionBlockListItem): Observable<TaxonDescriptionBlockListItem> {
        const url = this.createUrlBuilder().upload()
            .build()

        const req = this.apiClient
            .queryBuilder(url)
            .patch()
            .queryParam("id", block.id.toString())
            .body(block)
            //.addJwtAuth(userToken)
            .build()

        return this.apiClient.send(req).pipe(
            catchError((e) => {
                console.log(" error ")
                console.error(e)
                return of(null)
            }),
            map((blockJson) => {
                console.log(" mapping ")
                if (blockJson === null) {
                    return null
                }
                return TaxonDescriptionBlockListItem.fromJSON(blockJson);
            })
        )
    }

    private createUrlBuilder(): TaxonDescriptionBlockQueryBuilder {
        return new TaxonDescriptionBlockQueryBuilder(this.appConfig.apiUri());
    }
}
