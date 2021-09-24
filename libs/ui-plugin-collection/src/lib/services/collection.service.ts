import {
    BehaviorSubject,
    combineLatest,
    merge,
    Observable,
    of,
    ReplaySubject,
    throwError,
} from 'rxjs';
import { CollectionCategory } from '../dto/Category.output.dto';
import {
    AlertService,
    ApiClientService,
    formToQueryParams,
    UserRole,
    UserService,
} from '@symbiota2/ui-common';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    shareReplay,
    startWith,
    switchMap,
    take,
    tap,
} from 'rxjs/operators';
import { Collection, CollectionListItem } from '../dto/Collection.output.dto';
import { Injectable, EventEmitter } from '@angular/core';
import { CollectionInputDto } from '../dto/Collection.input.dto';
import {
    ApiCollectionCategoryOutput,
    ApiCollectionListItem,
    ApiCollectionOutput,
    ApiUserRole,
} from '@symbiota2/data-access';
import {
    CollectionRoleInput,
    CollectionRoleOutput,
} from '../dto/CollectionRole.dto';

interface FindAllParams {
    id?: number | number[];
    limit?: number;
    orderBy?: string;
}

@Injectable()
export class CollectionService {
    private readonly COLLECTION_BASE_URL = `${this.api.apiRoot()}/collections`;
    private readonly CATEGORY_BASE_URL = `${this.COLLECTION_BASE_URL}/categories`;

    private readonly currentCategories = new BehaviorSubject<
        ApiCollectionCategoryOutput[]
    >([]);
    private readonly collectionQueryParams = new BehaviorSubject<FindAllParams>(
        null
    );
    private readonly currentCollectionID = new BehaviorSubject<number>(-1);
    private readonly updateCollectionData = new ReplaySubject<
        Partial<CollectionInputDto>
    >();

    currentCollection: Observable<Collection> = merge(
        this.currentCollectionID.pipe(
            distinctUntilChanged(),
            switchMap((id) => {
                if (id > 0) {
                    return this.fetchCollectionByID(id);
                }
                return of(null);
            })
        ),
        this.updateCollectionData.pipe(
            switchMap((collectionData) => {
                return combineLatest([
                    this.users.currentUser,
                    this.currentCollectionID,
                ]).pipe(
                    take(1),
                    filter(([currentUser, currentCollectionID]) => {
                        return currentUser !== null && currentCollectionID > 0;
                    }),
                    switchMap(([currentUser, currentCollectionID]) => {
                        return this.updateByCollectionID(
                            currentCollectionID,
                            currentUser.token,
                            collectionData
                        );
                    }),
                    catchError((e) => {
                        this.alerts.showError(
                            `Cannot update collection: ${e.message}`
                        );
                        return of(null);
                    }),
                    filter((collection) => collection !== null)
                );
            })
        )
    ).pipe(shareReplay(1));

    collectionList = this.collectionQueryParams.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        switchMap((params) => this.fetchCollectionList(params)),
        shareReplay(1)
    );

    categories = this.currentCategories.asObservable().pipe(shareReplay(1));

    constructor(
        private readonly api: ApiClientService,
        private readonly users: UserService,
        private readonly alerts: AlertService
    ) {
        this.refreshCategories();
    }

    createNewCollection(
        collectionData: Partial<CollectionInputDto>,
        userToken: string
    ): Observable<Collection> {
        const req = this.api
            .queryBuilder(this.COLLECTION_BASE_URL)
            .post()
            .body(collectionData)
            .addJwtAuth(userToken)
            .build();

        return this.api.send(req).pipe(
            map((collection: ApiCollectionOutput) => {
                if (collection === null) {
                    return null;
                }
                return new Collection(collection);
            })
        );
    }

    setCollectionID(id: number) {
        this.currentCollectionID.next(id);
    }

    setCollectionQueryParams(findAllParams?: FindAllParams) {
        if (findAllParams) {
            this.collectionQueryParams.next(findAllParams);
        } else {
            this.collectionQueryParams.next(null);
        }
    }

    updateCurrentCollection(collectionData: Partial<CollectionInputDto>) {
        this.updateCollectionData.next(collectionData);
    }

    refreshCategories() {
        const req = this.api.queryBuilder(this.CATEGORY_BASE_URL).get().build();

        this.api
            .send(req)
            .pipe(
                map((categoryJsonLst: ApiCollectionCategoryOutput[]) => {
                    return categoryJsonLst.map((cat) => {
                        return new CollectionCategory(cat);
                    });
                })
            )
            .subscribe((categories) => {
                this.currentCategories.next(categories);
            });
    }

    isNameTaken(name: string): Observable<boolean> {
        var result = of(false);

        this.collectionList
            .pipe(
                map((collections) => {
                    collections.forEach((collection) => {
                        if (collection.collectionName === name) {
                            result = of(true);
                        }
                    });
                })
            )
            .subscribe();

        return result;
    }

    isCodeTaken(code: string): Observable<boolean> {
        var result = of(false);

        this.collectionList
            .pipe(
                map((collection) => {
                    for (var index = 0; index < collection.length; index++) {
                        if (
                            collection[index].collectionCode !== null &&
                            collection[index].collectionCode.toLowerCase() ===
                                code.toLowerCase()
                        ) {
                            result = of(true);
                        }
                    }
                })
            )
            .subscribe();

        return result;
    }

    getCurrentRoles(): Observable<CollectionRoleOutput[]> {
        return this.users.currentUser.pipe(
            switchMap((user) => {
                if(!!user) {
                    return this.currentCollection.pipe(
                        map((collection) => {
                            const url = `${this.COLLECTION_BASE_URL}/${collection.id}/roles`;
                            const req = this.api
                                .queryBuilder(url)
                                .get()
                                .addJwtAuth(user.token)
                                .build();
            
                            return req;
                        }),
                        switchMap((req) => {
                            return this.api.send(req).pipe(
                                map((response: CollectionRoleOutput[]) => {
                                    return response;
                                })
                            );
                        })
                    );
                } else { return null };
            })
        )
        
    }

    postCollectionRole(role: CollectionRoleInput): Observable<boolean> {
        return this.users.currentUser.pipe(
            switchMap((user) => {
                if (!!user) {
                    return this.currentCollection.pipe(
                        map((collection) => {
                            const url = `${this.COLLECTION_BASE_URL}/${collection.id}/roles`;
                            const req = this.api
                                .queryBuilder(url)
                                .post()
                                .body(role)
                                .addJwtAuth(user.token)
                                .build();

                            return req;
                        }),
                        switchMap((req) => {
                            return this.api.send(req).pipe(
                                map((response) => {
                                    return !!response ? true : false;
                                })
                            );
                        })
                    );
                } else {
                    return of(false);
                }
            })
        );
    }

    deleteCollectionRole(body: CollectionRoleInput): Observable<boolean> {
        return this.users.currentUser.pipe(
            switchMap((user) => {
                if(!!user) {
                    return this.currentCollection.pipe(
                        map((collection) => {
                            const url = `${this.COLLECTION_BASE_URL}/${collection.id}/roles`;
                            const req = this.api
                                .queryBuilder(url)
                                .delete()
                                .body(body)
                                .addJwtAuth(user.token)
                                .build();

                            return req;
                        }),
                        switchMap((req) => {
                            return this.api.send(req).pipe(
                                map((response) => {
                                    return !!response ? true : false;
                                })
                            )
                        })
                    )
                }
            })
        )
    }

    doesRoleExist(roleInput: CollectionRoleInput): Observable<boolean>{
         return this.getCurrentRoles().pipe(
             map((roles) => {
                 for(var index = 0; index < roles.forEach.length; index += 1){
                    if(roles[index].user.uid === roleInput.uid && roles[index].name === roleInput.role ){
                        return true;
                    }
                 }
                 return false;
             })
         );
    }

    private fetchCollectionList(
        findAllParams?: FindAllParams
    ): Observable<CollectionListItem[]> {
        const url = this.api.queryBuilder(this.COLLECTION_BASE_URL).get();

        if (findAllParams) {
            for (const key of Object.keys(findAllParams)) {
                url.queryParam(key, findAllParams[key]);
            }
        }

        return this.api.send(url.build()).pipe(
            map((collections: ApiCollectionListItem[]) => {
                return collections.map(
                    (collection) => new CollectionListItem(collection)
                );
            })
        );
    }

    private fetchCollectionByID(id: number): Observable<Collection> {
        const url = `${this.COLLECTION_BASE_URL}/${id}`;
        const req = this.api.queryBuilder(url).get().build();

        return this.api.send(req).pipe(
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
        collectionData: Partial<CollectionInputDto>
    ): Observable<Collection> {
        const url = `${this.COLLECTION_BASE_URL}/${id}`;
        const req = this.api
            .queryBuilder(url)
            .patch()
            .body(collectionData)
            .addJwtAuth(userToken)
            .build();

        return this.api.send(req).pipe(
            map((collection: ApiCollectionOutput) => {
                if (collection !== null) {
                    return new Collection(collection);
                }
                return null;
            })
        );
    }
}
