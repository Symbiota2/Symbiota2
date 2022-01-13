import { Observable } from 'rxjs'
import { ApiClientService, AppConfigService } from '@symbiota2/ui-common'
import { map } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import { ImageTagKeyQueryBuilder } from './imageTagKey-query-builder'
import { ImageTagKeyListItem } from '../../dto';

interface FindAllParams {
    imageIDs: number[]
    taxonIDs: number[]
    limit?: number
}

@Injectable()
export class ImageTagKeyService {
    constructor(
        private readonly apiClient: ApiClientService,
        private readonly appConfig: AppConfigService) { }

    private createQueryBuilder(): ImageTagKeyQueryBuilder {
        return new ImageTagKeyQueryBuilder(this.appConfig.apiUri());
    }

    public getUrl() {
        const apiBaseUrl = this.appConfig.apiUri()
        const x = new URL(`${apiBaseUrl}/image/tagKey`)
        return this.apiClient.apiRoot()
    }

    findAll(params?: FindAllParams): Observable<ImageTagKeyListItem[]> {
        const url = this.createQueryBuilder()
            .findAll()
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return ImageTagKeyListItem.fromJSON(o);
                }))
            )
    }

    findByID(id: number): Observable<ImageTagKeyListItem> {
        const url = this.createQueryBuilder()
            .findOne()
            .id(id)
            .build();

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, Record<string, unknown>>(query)
            .pipe(map((o) => ImageTagKeyListItem.fromJSON(o)))

    }

}
