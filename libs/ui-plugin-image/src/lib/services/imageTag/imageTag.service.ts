import { Observable, of } from 'rxjs';
import { AlertService, ApiClientService, AppConfigService, UserService } from '@symbiota2/ui-common';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core'
import { ImageTagQueryBuilder } from './imageTag-query-builder'
import { ImageTagListItem } from '../../dto';

interface FindAllParams {
    imageIDs?: number[]
    ids?: number[]
    limit?: number
    offset?: number
}

@Injectable()
export class ImageTagService {
    private jwtToken = this.user.currentUser.pipe(map((user) => user.token))
    // private readonly _currentUpload = new BehaviorSubject<ApiTaxonomyUpload>(null)
    private creatorUID = null

    constructor(
        private readonly alerts: AlertService,
        private readonly apiClient: ApiClientService,
        private readonly user: UserService,
        private readonly appConfig: AppConfigService)
    {
        //Fill in the current user id
        this.user.currentUser.subscribe((user) => {
            if (user) {
                this.creatorUID = user.uid
            }
        })
    }

    private createQueryBuilder(): ImageTagQueryBuilder {
        return new ImageTagQueryBuilder(this.appConfig.apiUri());
    }

    public getUrl() {
        const apiBaseUrl = this.appConfig.apiUri()
        const x = new URL(`${apiBaseUrl}/image/tag`)
        return this.apiClient.apiRoot()
    }

    findAll(params?: FindAllParams): Observable<ImageTagListItem[]> {
        const qb = this.createQueryBuilder()
            .findAll()

        if (params.ids) {
            qb.ids(params.ids)
        }

        if (params.imageIDs) {
            qb.imageIds(params.imageIDs)
        }

        if (params.offset) {
            qb.offset(params.offset)
        }

        if (params.limit) {
            qb.limit(params.limit)
        }

        const url = qb.build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return ImageTagListItem.fromJSON(o);
                }))
            )
    }

    findByID(id: number): Observable<ImageTagListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => ImageTagListItem.fromJSON(o)))

    }

    /**
     * sends request to api to delete an image record
     * @param id - the id of the image to delete
     * @returns Observable of response from api casted as `string`
     * @returns `of(null)` if image does not exist or does not have editing permission or api errors
     */
    delete(id): Observable<string> {
        const url = this.createQueryBuilder()
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

}
