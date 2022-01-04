import { Observable, of } from 'rxjs';
import { AlertService, ApiClientService, AppConfigService, UserService } from '@symbiota2/ui-common';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core'
import { ImageQueryBuilder } from './image-query-builder'
import { PhotographerInfoListItem } from '../../dto/PhotographerInfoListItem';
import { ImageListItem } from '../../dto';
import { ImageInputDto } from '../../dto/ImageInputDto';
import { ImageAndTaxonListItem } from '../../dto/ImageAndTaxonListItem';

interface FindAllParams {
    imageIDs: number[]
    taxonIDs: number[]
    limit?: number
}

@Injectable()
export class ImageService {
    private jwtToken = this.user.currentUser.pipe(map((user) => user.token))

    constructor(
        private readonly alerts: AlertService,
        private readonly user: UserService,
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
            )
    }

    findPhotographers(): Observable<PhotographerInfoListItem[]> {
        const url = this.createQueryBuilder()
            .findPhotographers()
            .build()

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, PhotographerInfoListItem[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return o;
                }))
            )
    }

    findPhotographerNames(): Observable<string[]> {
        const url = this.createQueryBuilder()
            .findPhotographerNames()
            .build()

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return o;
                }))
            )
    }

    findImageTypes(): Observable<string[]> {
        const url = this.createQueryBuilder()
            .findImageTypes()
            .build()

        const query = this.apiClient.queryBuilder(url).get().build()
        return this.apiClient.send<any, string[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return o;
                }))
            )
    }

    imageSearch(
        taxonIds: number[],
        photographers: string[],
        imageTypes: string[],
        tagKeys: string[],
        countries: string[],
        provinces: string[]
    ): Observable<ImageListItem[]> {
        const url = this.createQueryBuilder()
            .imageSearch()
            .taxonIDs(taxonIds)
            .photographers(photographers)
            .imageTypes(imageTypes)
            .tagKeys(tagKeys)
            .countries(countries)
            .provinces(provinces)
            .build()

        const query = this.apiClient.queryBuilder(url).get().build();
        return this.apiClient.send<any, Record<string, unknown>[]>(query)
            .pipe(
                map((descriptions) => descriptions.map((o) => {
                    return ImageListItem.fromJSON(o);
                }))
            )
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


    /**
     * sends request to api to create an image record
     * @param image - the image to create
     * @returns Observable of response from api casted as `ImageListItem`
     * will be the created taxon
     * @returns `of(null)` if does not have editing permission or api errors
     */
    create(image: Partial<ImageInputDto>): Observable<ImageListItem> {

        const url = this.createQueryBuilder().create()
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const query = this.apiClient.queryBuilder(url)
                    .addJwtAuth(token)
                    .post()
                    .body([image])
                    .build()

                return this.apiClient.send(query).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((imageJson) => {
                        if (imageJson === null) {
                            return null
                        }
                        return ImageListItem.fromJSON(imageJson);
                    })
                )
            })
        )
    }

    /**
     * sends request to api to update an image record
     * @param image - the imagen to update
     * @returns Observable of response from api casted as `ImageListItem`
     * will be the updated image
     * @returns `of(null)` if image does not exist or does not have editing permission or api errors
     */
    update(image: ImageInputDto): Observable<ImageListItem> {
        const url = this.createQueryBuilder()
            .upload()
            .id(image.id)
            .build()

        return this.jwtToken.pipe(
            switchMap((token) => {
                const req = this.apiClient
                    .queryBuilder(url)
                    .patch()
                    .body([image])
                    .addJwtAuth(token)
                    .build()

                return this.apiClient.send(req).pipe(
                    catchError((e) => {
                        console.error(e)
                        return of(null)
                    }),
                    map((imageJson) => {
                        if (imageJson === null) {
                            return null
                        }
                        return ImageListItem.fromJSON(imageJson)
                    })
                )
            })
        )

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
