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
    first,
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
    ApiUserRoleName,
} from '@symbiota2/data-access';
import {
    CollectionRoleInput,
    CollectionRoleOutput,
} from '../dto/CollectionRole.dto';
import * as e from 'express';
import { ConstraintMetadata } from 'class-validator/types/metadata/ConstraintMetadata';

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

    isNameTaken(name: string, exempt?: string | string[]): Observable<boolean> {
        return this.collectionList.pipe(
            map((collections) => {
                for (var index = 0; index < collections.length; index += 1) {
                    if (collections[index].collectionName === name) {
                        if (!!exempt) {
                            if (
                                Array.isArray(exempt) &&
                                exempt.includes(name)
                            ) {
                                return false;
                            } else if (exempt === name) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                return false;
            })
        );
    }

    isCodeTaken(code: string, exempt?: string | string[]): Observable<boolean> {
        return this.collectionList.pipe(
            map((collections) => {
                for (var index = 0; index < collections.length; index += 1) {
                    if (
                        !!collections[index].collectionCode &&
                        collections[index].collectionCode.toLowerCase() ===
                            code.toLowerCase()
                    ) {
                        if (!!exempt) {
                            if (
                                Array.isArray(exempt) &&
                                exempt.includes(code)
                            ) {
                                return false;
                            } else if (
                                String(exempt).toLowerCase() ===
                                code.toLowerCase()
                            ) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                return false;
            })
        );
    }

    getCurrentRoles(): Observable<CollectionRoleOutput[]> {
        return this.users.currentUser.pipe(
            switchMap((user) => {
                if (!!user) {
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
                } else {
                    return null;
                }
            })
        );
    }

    postCollectionRole(
        uid: number,
        role: ApiUserRoleName
    ): Observable<boolean> {
        const newRole = new CollectionRoleInput(uid, role);

        return this.users.currentUser.pipe(
            switchMap((user) => {
                if (!!user) {
                    return this.currentCollection.pipe(
                        map((collection) => {
                            const url = `${this.COLLECTION_BASE_URL}/${collection.id}/roles`;
                            const req = this.api
                                .queryBuilder(url)
                                .post()
                                .body(newRole)
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

    deleteCollectionRole(
        uid: number,
        role: ApiUserRoleName
    ): Observable<boolean> {
        const body = new CollectionRoleInput(uid, role);

        return this.users.currentUser.pipe(
            switchMap((user) => {
                if (!!user) {
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
                            );
                        })
                    );
                }
            })
        );
    }

    doesRoleExist(uid: number, role: ApiUserRoleName): Observable<boolean> {
        return this.getCurrentRoles().pipe(
            map((roles) => {
                for (var index = 0; index < roles.length; index += 1) {
                    if (
                        roles[index].user.uid == uid &&
                        roles[index].name == role
                    ) {
                        return true;
                    }
                }
                return false;
            }),
            take(1)
        );
    }

    getUserRole(uid: number): Observable<CollectionRoleOutput> {
        return this.getCurrentRoles().pipe(
            map((roles) => {
                for (var index = 0; index < roles.length; index += 1) {
                    if (roles[index].user.uid == uid) {
                        return roles[index];
                    }
                }
                return null;
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
