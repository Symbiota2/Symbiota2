import { BehaviorSubject, Observable, of } from 'rxjs';
import { AlertService, ApiClientService, AppConfigService, UserService } from '@symbiota2/ui-common';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core'
import { I18nQueryBuilder } from './i18n-query-builder'

interface FindAllParams {
    imageIDs: number[]
    taxonIDs: number[]
    limit?: number
}

@Injectable()
export class I18nService {
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

    private createQueryBuilder(): I18nQueryBuilder {
        return new I18nQueryBuilder(this.appConfig.apiUri());
    }

    public getUrl() {
        return this.apiClient.apiRoot()
    }

    /**
     * sends request to api to update an i18n file
     * @param language - the two letter name of the language
     * @param key - the key
     * @param value - the new value
     * @param toTranslate - should this value be translatable?
     * @returns Observable of response from api cast as string, will be the updated string
     * @returns `of(null)` if key does not exist or does not have editing permission or api errors
     */
    update(language: string, key: string, value: string, toTranslate: boolean): Observable<string | null> {
        const url = this.createQueryBuilder()
            .upload()
            .language(language)
            .key(key)
            .value(value)

        // Should this be translated?
        if (toTranslate) {
            url.translatable()
        }

        return this.jwtToken.pipe(
            switchMap((token) => {
                const req = this.apiClient
                    .queryBuilder(url.build())
                    .patch()
                    // .addJwtAuth(token)
                    .build()

                return this.apiClient.send(req).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((result) => {
                        if (result === null) {
                            return null
                        }
                        return result
                    })
                )
            })
        )

    }


}
