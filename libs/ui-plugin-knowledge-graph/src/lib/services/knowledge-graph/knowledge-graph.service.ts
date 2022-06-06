import { BehaviorSubject, Observable, of } from 'rxjs';
import { AlertService, ApiClientService, AppConfigService, UserService } from '@symbiota2/ui-common';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core'
import { KnowledgeGraphQueryBuilder } from './knowledge-graph-query-builder'
import { KNOWLEDGE_GRAPH_API_BASE } from '../../routes';
import { KnowledgeGraphListItem } from '../../dto';

@Injectable()
export class KnowledgeGraphService {
    private jwtToken = this.user.currentUser.pipe(map((user) => user.token))
    // private readonly _currentUpload = new BehaviorSubject<ApiTaxonomyUpload>(null)
    private creatorUID = null

    constructor(
        private readonly alerts: AlertService,
        private readonly user: UserService,
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService)
    {
        //Fill in the current user id
        this.user.currentUser.subscribe((user) => {
            if (user) {
                this.creatorUID = user.uid
            }
        })
    }

    private createQueryBuilder(): KnowledgeGraphQueryBuilder {
        return new KnowledgeGraphQueryBuilder(this.appConfig.apiUri());
    }

    public getUrl() {
        return this.apiClient.apiRoot()
    }

    /**
     * sends request to api to list all of the knowledge graphs
     * @param none - no params
     * @returns Observable of response from api casted as KnowledgeGraphListItem[]
     * @returns `of(null)` if does not have editing permission or api errors
     */
    list(): Observable<KnowledgeGraphListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return KnowledgeGraphListItem.fromJSON(o);
                }))
            )
    }

    /**
     * sends request to api to build a graph
     * @param name - the graph to build
     * @returns Observable of response from api casted as `string`
     * @returns `of(null)` if does not have editing permission or api errors
     */
    build(name: string): Observable<string> {

        const url = this.createQueryBuilder().create()
            .name(name)
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const query = this.apiClient.queryBuilder(url)
                    .addJwtAuth(token)
                    .post()
                    .build()

                return this.apiClient.send(query).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((response) => {
                        if (response === null) {
                            return null
                        }
                        return "done";
                    })
                )
            })
        )
    }


    /**
     * sends request to api to delete a graph
     * @param name - the name of the graph to delete
     * @returns Observable of response from api casted as `string`
     * @returns `of(null)` if taxon does not exist or does not have editing permission or api errors
     */
    delete(name): Observable<string> {
        const url = this.createQueryBuilder()
            .delete()
            .name(name)
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

}
