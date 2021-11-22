import { HttpHeaderResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    AlertService,
    ApiClientService,
    ApiQueryBuilder,
    UserService,
} from '@symbiota2/ui-common';
import { CollectionService } from '@symbiota2/ui-plugin-collection';
import { HttpRequest } from 'aws-sdk';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import {
    CollectionArchive,
    PublishedCollection,
} from '../dto/DwcCollection.dto';

@Injectable()
export class DarwinCoreArchiveService {
    private readonly DARWINCORE_BASE_URL = `${this.api.apiRoot()}/dwc`;

    ArchiveList: Observable<CollectionArchive[]> = this.getArchiveList();

    constructor(
        private readonly api: ApiClientService,
        private readonly userService: UserService,
        private readonly collectionService: CollectionService,
        private readonly alertService: AlertService
    ) {}

    getCurrentCollectionArchiveInfo(): Observable<CollectionArchive> {
        return this.collectionService.currentCollection.pipe(
            switchMap((collection) => {
                var req = this.api
                    .queryBuilder(
                        `${this.DARWINCORE_BASE_URL}/collections/${collection.id}`
                    )
                    .head()
                    .build();

                return this.api.sendFullResponse(req).pipe(
                    switchMap((dwc: HttpResponse<ResponseType>) => {
                        if (dwc.ok) {
                            return this.ArchiveList.pipe(
                                map((archiveList) => {
                                    archiveList[0].updatedAt.toDateString
                                    return archiveList.find(
                                        ({ collectionID }) =>
                                            collectionID === collection.id
                                    );
                                })
                            );
                        } else {
                            return null;
                        }
                    })
                );
            })
        );
    }

    getArchiveList(): Observable<CollectionArchive[]> {
        const req = this.api
            .queryBuilder(`${this.DARWINCORE_BASE_URL}/collections`)
            .get()
            .build();

        return this.api
            .send(req)
            .pipe(map((archiveList: CollectionArchive[]) => archiveList));
    }

    /**
     * PUT request to the api to create a darwin core archive for the givin collection.
     * TODO: if the darwin core archive exists for the collection already, will set refresh flag to true in api request.
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
            })
        );
    }
}
