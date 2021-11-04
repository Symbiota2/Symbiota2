import { Injectable } from '@angular/core';
import {
    AlertService,
    ApiClientService,
    ApiQueryBuilder,
    UserService,
} from '@symbiota2/ui-common';
import { CollectionService } from '@symbiota2/ui-plugin-collection';
import { HttpRequest } from 'aws-sdk';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PublishedCollection } from '../dto/DwCCollection.dto';

@Injectable()
export class DarwinCoreArchiveService {
    private readonly DARWINCORE_BASE_URL = `${this.api.apiRoot()}/dwc`;

    constructor(
        private readonly api: ApiClientService,
        private readonly userService: UserService,
        private readonly collectionService: CollectionService,
        private readonly alertService: AlertService
    ) {}

    getCurrentCollectionArchive(): Observable<PublishedCollection> {
        return this.collectionService.currentCollection.pipe(
            switchMap((collection) => {
                var req = this.api
                    .queryBuilder(
                        `${this.DARWINCORE_BASE_URL}/collection/${collection.id}`
                    )
                    .get()
                    .build();

                return this.api.send(req).pipe(
                    map((dwc: PublishedCollection) => {
                        if (!dwc) {
                            console.log(dwc);
                        }

                        return dwc;
                    })
                );
            })
        );
    }
}
