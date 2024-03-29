import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    AlertService,
    ApiClientService,
    UserService,
} from '@symbiota2/ui-common';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { DwcArchive } from '../dto/Dwc.dto';
import { CollectionService } from './collection.service';


@Injectable()
export class DwcService {
    private readonly DARWINCORE_BASE_URL = `${this.api.apiRoot()}/dwc`;

    archiveList$: Observable<DwcArchive[]> = this.getArchiveList();

    constructor(
        private readonly api: ApiClientService,
        private readonly userService: UserService,
        private readonly collectionService: CollectionService,
        private readonly alertService: AlertService
    ) {}

    getCurrentCollectionArchiveInfo(): Observable<DwcArchive> {
        return this.collectionService.currentCollection.pipe(
            switchMap((collection) => {
                var req = this.api
                    .queryBuilder(
                        `${this.DARWINCORE_BASE_URL}/collections/${collection.id}`
                    )
                    .head()
                    .build();

                return this.api.sendFullResponse(req).pipe(
                    take(1),
                    catchError((err) => {
                        switch (err.status) {
                            case 404:
                                console.log("404 ERROR: dwc Archive does not exist for this collection");
                                break;
                        
                            default:
                                console.log("error getting Dwc Archive");
                                break;
                        }

                        //Handle the error here

                        return of(null);
                    }),
                    switchMap((dwc: HttpResponse<ResponseType>) => {
                        if ( dwc != null && dwc.ok) {
                            return this.archiveList$.pipe(
                                map((archiveList) => {
                                    return archiveList.find(
                                        ({ collectionID }) =>
                                            collectionID === collection.id
                                    );
                                })
                            );
                        } else {
                            return of(null);
                        }
                    })
                );
            })
        );
    }

    downloadCollectionArchive(collectionID: number): Observable<any> {

        const req = this.api
            .queryBuilder(`${this.DARWINCORE_BASE_URL}/collections/${collectionID}`)
            .get()
            .setResponseType("blob")
            .build();

        return this.api.send(req)
            .pipe(
                map((mReadableStream : any) => {
                    return mReadableStream;
                })
            )
    }

    getArchiveList(): Observable<DwcArchive[]> {
        const req = this.api
            .queryBuilder(`${this.DARWINCORE_BASE_URL}/collections`)
            .get()
            .build();

        return this.api
            .send(req, {skipLoading: true})
            .pipe(map((archiveList: DwcArchive[]) => {
                return archiveList;
            }));
    }

    /**
     * PUT request to the api to create a darwin core archive for the givin collection.
     *
     * @remarks user needs to have super admin access or collection admin access in order to use function
     *
     * @param collectionID
     * @returns boolean based if request is successful or not
     */
    createDarwinCoreArchive(collectionID: number): Observable<boolean> {
        return combineLatest([
            this.userService.currentUser,
            this.collectionService.currentCollection,
        ]).pipe(
            take(1),
            switchMap(([user, collection]) => {
                if (
                    !!user &&
                    !!collection &&
                    user.canEditCollection(collection.id)
                ) {
                    var req = this.api
                        .queryBuilder(
                            `${this.DARWINCORE_BASE_URL}/collections/${collection.id}`
                        )
                        .put()
                        .addJwtAuth(user.token)
                        .queryParam(`publish`, true)
                        .build();

                    return this.api.sendFullResponse(req).pipe(
                        take(1),
                        map((res: HttpResponse<ResponseType>) => {
                            console.log(res);
                            return res.ok;
                        })
                    );
                } else {
                    this.alertService.showError(
                        'User does not have permission to edit collection'
                    );
                    return of(false);
                }
            }),
        );
    }
}
