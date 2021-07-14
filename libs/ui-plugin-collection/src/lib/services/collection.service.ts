import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { CollectionCategory } from '../dto/Category.output.dto';
import {
    ApiClientService, UserService
} from '@symbiota2/ui-common';
import {
    catchError,
    filter,
    map,
    switchMap, take
} from 'rxjs/operators';
import { Collection, CollectionListItem } from '../dto/Collection.output.dto';
import { Injectable } from '@angular/core';
import { CollectionInputDto } from '../dto/Collection.input.dto';
import {
    ApiCollectionCategoryOutput,
    ApiCollectionListItem, ApiCollectionOutput
} from '@symbiota2/data-access';

interface FindAllParams {
    id?: number | number[];
    limit?: number;
    orderBy?: string;
}

@Injectable()
export class CollectionService {
    private readonly COLLECTION_BASE_URL = `${this.api.apiRoot()}/collections`;
    private readonly CATEGORY_BASE_URL = `${this.COLLECTION_BASE_URL}/categories`;

    private readonly currentCategories = new BehaviorSubject<ApiCollectionCategoryOutput[]>([]);

    private readonly collectionQueryParams = new BehaviorSubject<FindAllParams>(null);
    private readonly currentCollectionID = new BehaviorSubject<number>(-1);

    currentCollection = this.currentCollectionID.pipe(
        switchMap((id) => {
            if (id > 0) {
                return this.fetchCollectionByID(id)
            }
            return of(null);
        })
    );

    collectionList = this.collectionQueryParams.pipe(
        switchMap((params) => this.fetchCollectionList(params))
    );

    categories = this.currentCategories.asObservable();

    constructor(
        private readonly api: ApiClientService,
        private readonly users: UserService) {

        this.refreshCategories();
    }

    setCollectionID(id: number) {
        this.currentCollectionID.next(id);
    }

    setCollectionQueryParams(findAllParams?: FindAllParams) {
        if (findAllParams) {
            this.collectionQueryParams.next(findAllParams);
        }
        else {
            this.collectionQueryParams.next(null);
        }
    }

    updateCurrentCollection(collectionData: Partial<CollectionInputDto>) {
        combineLatest([
            this.users.currentUser,
            this.currentCollection
        ]).pipe(
            take(1),
            filter(([currentUser, currentCollection]) => {
                return currentUser !== null && currentCollection !== null;
            }),
            switchMap(([currentUser, currentCollection]) => {
                return this.updateByCollectionID(
                    currentCollection.id,
                    currentUser.token,
                    collectionData
                );
            })
        ).subscribe((collection) => {
            // Refresh the current collection
            this.currentCollectionID.next(collection.id);
        });
    }

    refreshCategories() {
        const req = this.api.queryBuilder(this.CATEGORY_BASE_URL)
            .get()
            .build();

        this.api.send(req).pipe(
            map((categoryJsonLst: ApiCollectionCategoryOutput[]) => {
                return categoryJsonLst.map((cat) => {
                    return new CollectionCategory(cat);
                });
            })
        ).subscribe((categories) => {
            this.currentCategories.next(categories);
        });
    }

    private fetchCollectionList(findAllParams?: FindAllParams): Observable<CollectionListItem[]> {
        const url = this.api.queryBuilder(this.COLLECTION_BASE_URL).get();

        for (const key of Object.keys(findAllParams)) {
            url.queryParam(key, findAllParams[key]);
        }

        if (findAllParams && findAllParams.limit) {
            url.queryParam('limit', findAllParams.limit);
        }

        if (findAllParams && findAllParams.orderBy) {
            url.queryParam('orderBy', findAllParams.orderBy);
        }

        return this.api.send(url.build()).pipe(
            catchError((e) => {
                console.error(e);
                return of([]);
            }),
            map((collections: ApiCollectionListItem[]) => {
                return collections.map((collection) => new CollectionListItem(collection));
            })
        );
    }

    private fetchCollectionByID(id: number): Observable<Collection> {
        const url = `${this.COLLECTION_BASE_URL}/${id}`;
        const req = this.api.queryBuilder(url).get().build();

        return this.api.send(req).pipe(
            catchError((e) => {
                console.error(e);
                return of(null);
            }),
            map((collection: ApiCollectionOutput) => {
                if (collection === null) {
                    return null;
                }
                return new Collection(collection);
            })
        );
    }

    private updateByCollectionID(
        id: number,
        userToken: string,
        collectionData: Partial<CollectionInputDto>): Observable<Collection> {

        const url = `${this.COLLECTION_BASE_URL}/${id}`;
        const req = this.api.queryBuilder(url)
            .patch()
            .body(collectionData)
            .addJwtAuth(userToken)
            .build();

        return this.api.send(req).pipe(
            catchError((e) => {
                console.error(e);
                return of(null);
            }),
            map((collection: ApiCollectionOutput) => {
                if (collection !== null) {
                    return new Collection(collection);
                }
                return null;
            })
        );
    }
}
