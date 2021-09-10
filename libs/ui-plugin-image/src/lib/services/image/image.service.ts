import { Observable } from 'rxjs'
import { ApiClientService, AppConfigService } from '@symbiota2/ui-common'
import { map } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import { ImageQueryBuilder } from './image-query-builder'
import { ImageListItem } from '../../dto/image-list-item'

interface FindAllParams {
    imageIDs: number[]
    taxonIDs: number[]
    limit?: number
}

@Injectable()
export class ImageService {
    constructor(
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) { }

    private createQueryBuilder(): ImageQueryBuilder {
        return new ImageQueryBuilder(this.appConfig.apiUri());
    }

    public getUrl() {
        const apiBaseUrl = this.appConfig.apiUri()
        const x = new URL(`${apiBaseUrl}/image`)
        return this.apiClient.apiRoot()
    }

    findAll(params?: FindAllParams): Observable<ImageListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .imageIDs(params? params.imageIDs : [])
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return ImageListItem.fromJSON(o);
                }))
            );
    }

    findByTaxonIDs(ids: number[]): Observable<ImageListItem[]> {
        const url = this.createQueryBuilder()
            .findByTaxonIDs()
            .taxonIDs(ids)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return ImageListItem.fromJSON(o);
                }))
            );
    }

    findDescriptions(tid): Observable<ImageListItem[]> {
        const url = this.createQueryBuilder()
            .findDescriptions()
            .taxonIDs([tid])
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return ImageListItem.fromJSON(o);
                }))
            );
    }

    findByID(id: number): Observable<ImageListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => ImageListItem.fromJSON(o)))

    }

}
