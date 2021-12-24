import { Observable } from 'rxjs'
import { ApiClientService, AppConfigService } from '@symbiota2/ui-common'
import { map } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import { ImageTagQueryBuilder } from './imageTag-query-builder'
import { ImageTagListItem } from '../../dto';

interface FindAllParams {
    imageIDs: number[]
    taxonIDs: number[]
    limit?: number
}

@Injectable()
export class ImageTagService {
    constructor(
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) { }

    private createQueryBuilder(): ImageTagQueryBuilder {
        return new ImageTagQueryBuilder(this.appConfig.apiUri());
    }

    public getUrl() {
        const apiBaseUrl = this.appConfig.apiUri()
        const x = new URL(`${apiBaseUrl}/imageTag`)
        return this.apiClient.apiRoot()
    }

    findAll(params?: FindAllParams): Observable<ImageTagListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .build()

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

}
