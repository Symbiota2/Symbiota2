import { BehaviorSubject, Observable, of } from 'rxjs';
import { AlertService, ApiClientService, AppConfigService, UserService } from '@symbiota2/ui-common';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core'
import { KnowledgeGraphQueryBuilder } from './knowledge-graph-query-builder'
import { KNOWLEDGE_GRAPH_API_BASE } from '../../routes';
import { KnowledgeGraphListItem } from '../../dto';

interface FindAllParams {
    imageIDs: number[]
    taxonIDs: number[]
    limit?: number
}

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
     * sends request to api to create an image record
     * @param image - the image to create
     * @returns Observable of response from api casted as `ImageListItem`
     * will be the created taxon
     * @returns `of(null)` if does not have editing permission or api errors
     */
    findAll(params?: FindAllParams): Observable<KnowledgeGraphListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .imageIDs(params? params.imageIDs : [])
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return KnowledgeGraphListItem.fromJSON(o);
                }))
            )
    }

}
