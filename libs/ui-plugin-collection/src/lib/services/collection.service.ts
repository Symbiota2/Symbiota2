import {
    BehaviorSubject,
    combineLatest,
    merge,
    Observable,
    of,
    ReplaySubject,
} from 'rxjs';
import {
    CollectionCategory,
    CollectionIDBody,
} from '../dto/Category.output.dto';
import {
    AlertService,
    ApiClientService,
    UserService,
} from '@symbiota2/ui-common';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    mergeMap,
    shareReplay,
    switchMap,
    take,
    tap,
} from 'rxjs/operators';
import { Collection, CollectionListItem } from '../dto/Collection.output.dto';
import { Injectable } from '@angular/core';
import { CollectionInputDto } from '../dto/Collection.input.dto';
import {
    ApiCollectionCategoryOutput,
    ApiCollectionListItem,
    ApiCollectionOutput,
    ApiUserRoleName,
} from '@symbiota2/data-access';
import {
    CollectionRoleInput,
    CollectionRoleOutput,
} from '../dto/CollectionRole.dto';
import { log } from 'console';
import { copyFile } from 'fs';

interface FindAllParams {
    id?: number | number[];
    limit?: number;
    orderBy?: string;
}

@Injectable()
export class CollectionService {
    /** Base url for collections api route */
    private readonly COLLECTION_BASE_URL = `${this.api.apiRoot()}/collections`;

    /** Base url for collections category api route */
    private readonly CATEGORY_BASE_URL = `${this.api.apiRoot()}/collection-categories`;

    /** List of last collection categories pulled from api */
    private readonly currentCategories = new BehaviorSubject<
        ApiCollectionCategoryOutput[]
    >([]);

    /** Behavior Subject for collection Query Parameters. Initialized to null.
     * @see {@link setCollectionQueryParams} set new query parameters*/
    private readonly collectionQueryParams = new BehaviorSubject<FindAllParams>(
        null
    );

    /** ID of collection to be set as the `currentCollection`
     * @see {@link setCollectionID} to change currentCollectionID
     */
    private readonly currentCollectionID = new BehaviorSubject<number>(-1);

    /** data for updating the current collection */
    private readonly updateCollectionData = new ReplaySubject<
        Partial<CollectionInputDto>
    >();

    /** an Observable of collection of primary focus.
     * if `currentCollectionID` is invalid, currentCollection is set to of(null)
     * if there are changes in `updateCollectionData`, collection will update values with data and patch collection to api*/
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
                    this.userService.currentUser,
                    this.currentCollectionID,
                ]).pipe(
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
                        this.alertService.showError(
                            `Cannot update collection: ${e.message}`
                        );
                        return of(null);
                    }),
                    filter((collection) => collection !== null),
                );
            })
        ),
    ).pipe(shareReplay(1));

    /** Observable of a list of `collectionsListItem` pulled from api fulfilling `collectionQueryParams`
     *  @see {@link CollectionService.collectionQueryParams} used as parameter when fetching collection list
     */
    collectionList: Observable<
        CollectionListItem[]
    > = this.collectionQueryParams.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        switchMap((params) => this.fetchCollectionList(params)),
        shareReplay(1)
    );

    /** Observable of a list all categories from api.
     * Each `ApiCollectionCategoryOutput` also contains a list of all collections in category
     */
    categories: Observable<
        ApiCollectionCategoryOutput[]
    > = this.currentCategories.asObservable().pipe(shareReplay(1));

    constructor(
        private readonly api: ApiClientService,
        private readonly userService: UserService,
        private readonly alertService: AlertService
    ) {
        this.refreshCategories();
    }

    /**
     * sends a post request to api to create new collection using collectionData.
     * Uses `UserService` to check if a super admin is logged in before sending request
     * @param collectionData partial data to be used to set values of new collection
     * @returns results of the post request as a `of(collection)`. if there is an api
     *  error this will return as `of(null)`. will also return `of(null)` if there isn't
     *  a super admin logged in
     */
    createNewCollection(
        collectionData: Partial<CollectionInputDto>
    ): Observable<Collection> {
        return this.userService.currentUser.pipe(
            //verify user can create new collection
            switchMap((user) => {
                if (!!user && user.isSuperAdmin()) {
                    //create request for api
                    const req = this.api
                        .queryBuilder(this.COLLECTION_BASE_URL)
                        .post()
                        .body(collectionData)
                        .addJwtAuth(user.token)
                        .build();

                    //send request to api
                    return this.api.send(req).pipe(
                        map((collection: ApiCollectionOutput) => {
                            if (!!collection) {
                                //add collection to Category if it exists
                                this.addCollectionToCategory(
                                    collectionData.categoryID,
                                    collection.id
                                ).subscribe();
                            }

                            return new Collection(collection);
                        })
                    );
                } else {
                    this.alertService.showError(
                        'Create new collection: Permission Denied'
                    );
                    return null;
                }
            })
        );
    }

    /**
     * sends a POST request to add a collection to a categories list of collections
     * @remarks
     * uses UserService to check for super admin permission. if permission is
     * not found the function defaults to null
     * @param categoryID ID of category that will be modified
     * @param collectionID ID of collection that will be added to category
     * @returns Observable of `CollectionCategory` or null if request to api failed
     */
    addCollectionToCategory(
        categoryID: number,
        collectionID: number
    ): Observable<CollectionCategory> {
        var collectionIDBody = new CollectionIDBody(collectionID);

        return this.userService.currentUser.pipe(
            switchMap((user) => {
                if (!!user && user.isSuperAdmin()) {
                    //create request for api
                    const req = this.api
                        .queryBuilder(
                            `${this.CATEGORY_BASE_URL}/${categoryID}/collections`
                        )
                        .post()
                        .body(collectionIDBody)
                        .addJwtAuth(user.token)
                        .build();

                    return this.api.send(req).pipe(
                        map((res: CollectionCategory) => {
                            if (!res) {
                                this.alertService.showError(
                                    'Error adding Collection to Category'
                                );
                            }

                            return res;
                        })
                    );
                } else {
                    this.alertService.showError(
                        'Add collection to category: Permission Denied'
                    );
                }
            })
        );
    }

    /**
     * updates `currentCollectionID` triggering `CollectionService.currentCollection` to be updated as well
     * @see {@link currentCollection}
     * @see {@link currentCollectionID}
     * @param id number to be set to next current collection id.
     *
     * @remarks
     * id has to be greater than 0 in order to be a valid id
     */
    setCollectionID(id: number) {
        this.currentCollectionID.next(id);
    }

    /**
     * updates `collectionQueryParams` with new search parameters or
     * null if nothing is passed in.
     * this will also trigger on update on `collectionList` using new parameters
     * @param findAllParams new search parameters to be applied to next api pull
     *  of collections
     *
     * @see {@link collectionQueryParams}
     * @see {@link collectionList}
     */
    setCollectionQueryParams(findAllParams?: FindAllParams) {
        if (findAllParams) {
            this.collectionQueryParams.next(findAllParams);
        } else {
            this.collectionQueryParams.next(null);
        }
    }

    /**
     * updates `updateCollectionData` that then triggers `currentCollection`
     * to apply changes to itself and send a patch request though api
     *
     * @remark user must be logged in and have permission to edit current collection to update.
     *
     * @param collectionData updated collection data
     *
     * @see {@link updateCollectionData}
     * @see {@link currentCollection}
     */
    updateCurrentCollection(collectionData: Partial<CollectionInputDto>): Observable<Boolean> {
        return combineLatest([this.userService.currentUser, this.currentCollection]).pipe(
            take(1),
            map(([user, collection]) => {
                if (!!user && !!collection && user.canEditCollection(collection.id)){
                    this.updateCollectionData.next(collectionData);
                    return true;
                } else {
                    this.alertService.showError(
                        'User does not have permission to edit collection'
                    );
                    return false;
                }
            })
        )
    }

    getCollection(id: number): Observable<Collection>{
        const url = `${this.COLLECTION_BASE_URL}/${id}`;
        const req = this.api.queryBuilder(url).get().build();

        return this.api.send(req).pipe(
            map((collection: ApiCollectionOutput) => {
                if (collection === null) {
                    return null;
                }
                return new Collection(collection);
            }),
            take(1)
        );
    }

    /**
     * refreshes categories in Observable `currentCategories` with latest from api
     */
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


    /**
     * checks if Collection Name is already in use in existing collections
     * @param name name that will be checked for usage
     * @param exception a single name or list of names that are allowed
     *  to be the same as `name`
     * @returns `of(true)` if name is taken and not in exception and `of(false)`
     * if name is in exception or not in use
     *
     * @remarks
     * function used in form validation
     */
    isNameTaken(
        name: string,
        exception?: string | string[]
    ): Observable<boolean> {
        return this.collectionList.pipe(
            map((collections) => {
                for (var index = 0; index < collections.length; index += 1) {
                    if (collections[index].collectionName === name) {
                        if (!!exception) {
                            if (
                                Array.isArray(exception) &&
                                exception.includes(name)
                            ) {
                                return false;
                            } else if (exception === name) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                return false;
            }),
            take(1)
        );
    }

    /**
     * checks if Collection Code is already in use in existing collections
     * @param code code that will be checked for usage
     * @param exception a single code or list of names that are allowed
     *  to be the same as `name`
     * @returns `of(true)` if code is taken and not in exception and `of(false)`
     * if code is in exception or not in use
     *
     * @remarks
     * function used in form validation
     */
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
            }),
            take(1)
        );
    }

    /**
     * Fetches latest roles for current collection from api
     * @returns `Observable` of list of collection Roles for the current collection.
     * if current user does not have collection permission returns `of(null)` and displays error
     * if there is no user logged in return `of(null)` and displays error
     *
     */
    getCurrentRoles(): Observable<CollectionRoleOutput[]> {
        return this.userService.currentUser.pipe(
            switchMap((user) => {
                if (!!user) {
                    return this.currentCollection.pipe(
                        switchMap((collection) => {
                            if (user.canEditCollection(collection.id)) {
                                const url = `${this.COLLECTION_BASE_URL}/${collection.id}/roles`;
                                const req = this.api
                                    .queryBuilder(url)
                                    .get()
                                    .addJwtAuth(user.token)
                                    .build();

                                return this.api.send(req).pipe(
                                    map((response: CollectionRoleOutput[]) => {
                                        return response;
                                    })
                                );
                            } else {
                                this.alertService.showError(
                                    'User does not have permission to get current collection roles'
                                );
                                return null;
                            }
                        })
                    );
                } else {
                    this.alertService.showError(
                        'User must be logged in to get collection roles'
                    );
                    return null;
                }
            })
        );
    }

    /**
     * sends a post request to api to create a new role for the current collection
     * @param uid user id of the user obtaining new role
     * @param role a `ApiUserRoleName` string or enum defining the type of role
     * @returns Observable of new collection role sent back from api.
     * @returns `of(null)` if user does not exist or does not have permission to edit collection roles
     */
    postCollectionRole(
        uid: number,
        role: ApiUserRoleName
    ): Observable<CollectionRoleOutput> {
        const newRole = new CollectionRoleInput(uid, role);

        return this.userService.currentUser.pipe(
            switchMap((user) => {
                if (!!user) {
                    return this.currentCollection.pipe(
                        switchMap((collection) => {
                            if (user.canEditCollection(collection.id)) {
                                const url = `${this.COLLECTION_BASE_URL}/${collection.id}/roles`;
                                const req = this.api
                                    .queryBuilder(url)
                                    .post()
                                    .body(newRole)
                                    .addJwtAuth(user.token)
                                    .build();

                                return this.api.send(req).pipe(
                                    map((response: CollectionRoleOutput) => {
                                        return response;
                                    })
                                );
                            } else {
                                this.alertService.showError(
                                    'User does not have permission to create current collection roles'
                                );

                                return null;
                            }
                        })
                    );
                } else {
                    this.alertService.showError(
                        'User must be logged in to create new collection role'
                    );
                    return null;
                }
            })
        );
    }

    /**
     * sends request to api to delete collection role from a collection
     * @param uid user id for user of role that will be removed
     * @param role specific role name that will be removed
     * @returns Observable of response from api casted as `CollectionRoleOutput`.
     * will be the deleted collection or null if api has errors
     * @returns `of(null)` if user does not exist or does not have collection permission.
     */
    deleteCollectionRole(
        uid: number,
        role: ApiUserRoleName
    ): Observable<CollectionRoleOutput> {
        const body = new CollectionRoleInput(uid, role);

        return this.userService.currentUser.pipe(
            switchMap((user) => {
                if (!!user) {
                    return this.currentCollection.pipe(
                        switchMap((collection) => {
                            if (user.canEditCollection(collection.id)) {
                                const url = `${this.COLLECTION_BASE_URL}/${collection.id}/roles`;
                                const req = this.api
                                    .queryBuilder(url)
                                    .delete()
                                    .body(body)
                                    .addJwtAuth(user.token)
                                    .build();

                                return this.api.send(req).pipe(
                                    map((response: CollectionRoleOutput) => {
                                        return response;
                                    })
                                );
                            } else {
                                this.alertService.showError(`User does not have permission to delete current collection roles`)
                                return null;
                            }
                        })
                    );
                } else {
                    this.alertService.showError(
                        `User must be logged in to delete collection role`
                    );
                    return null;
                }
            })
        );
    }

    /**
     * checks if role exist in current roles from api.
     * @param uid user id of user attached to search role
     * @param role specific role name of search role
     * @returns Observable of boolean result. true of role exist. false if role doesn't exist.
     * 
     * @remarks 
     * used for form validation
     */
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

    /**
     * gets a single role with userID matching uid from `currentCollection`'s roles 
     * @param uid user id attached to collection role to be fetched
     * @returns  Observable of first collection role that has user id matching to uid
     * @returns `of(null)` if no role exist for user
     */
    getUserRole(uid: number): Observable<CollectionRoleOutput> {
        return this.getCurrentRoles().pipe(
            map((roles) => {
                for (var index = 0; index < roles.length; index += 1) {
                    if (roles[index].user.uid == uid) {
                        return roles[index];
                    }
                }
                this.alertService.showError(`User Role not found for uid${uid}`);
                return null;
            })
        );
    }

    /**
     * sends request to api to get list of all collections.
     * gets only the collections matching search parameter if `findAllParams` exists
     * @param findAllParams optional search parameters for api call to filter returned collections
     * @returns Observable of collection list returned from api.
     * @private
     */
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

    /**
     * sends request to api to get collection with matching id
     * @param id id of collection to be fetched from api
     * @returns `Observable` of single collection retrieved from api. could be null
     * @private
     */
    private fetchCollectionByID(id: number): Observable<Collection> {
        const url = `${this.COLLECTION_BASE_URL}/${id}`;
        const req = this.api.queryBuilder(url).get().build();

        return this.api.send(req).pipe(
            map((collection: ApiCollectionOutput) => {
                if (collection === null) {
                    this.alertService.showError("Api error while getting collection by id")
                    return null;
                }
                return new Collection(collection);
            })
        );
    }

    /**
     * sends request to api to patch given collection with collectionData
     * @param id id of collection to be updated
     * @param userToken user access token needed to update collection
     * @param collectionData data to be patched into collection
     * @returns `Observable` of updated collection from api or `null` if api has errors
     * @private
     */
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
                    this.alertService.showMessage("Collection Updated")
                    return new Collection(collection);
                }
                this.alertService.showError("Api error updating collection by id")
                return null;
            })
        );
    }
}

