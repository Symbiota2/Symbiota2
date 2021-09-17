import { Injectable, EventEmitter } from '@angular/core';
import {
    BehaviorSubject,
    combineLatest,
    Observable,
    of,
    Subscription,
    timer,
} from 'rxjs';
import { User, UserProfileData } from './dto/user.class';
import { ApiClientService } from '../api-client';
import { plainToClass } from 'class-transformer';
import {
    catchError,
    delay,
    filter,
    finalize,
    map,
    shareReplay,
    skip,
    startWith,
    switchMap,
    take,
    tap,
} from 'rxjs/operators';
import { ApiLoginResponse, ApiUserNotification } from '@symbiota2/data-access';
import { AlertService, LoadingService } from '../alert';
import { HttpErrorResponse } from '@angular/common/http';
import jwtDecode from 'jwt-decode';
import { ApiCreateUserData, ApiUser } from '@symbiota2/data-access';
import { UserOutputDto } from '@symbiota2/api-auth'

type AuthData = { username?: string; password?: string };
interface NotificationResults {
    count: number;
    notifications: ApiUserNotification[];
}

/**
 * Service for retrieving users from the API
 */
@Injectable()
export class UserService {
    private static readonly ONE_MINUTE = 60 * 1000;
    private static readonly TEN_SECONDS = 10 * 1000;

    private readonly _currentUser = new BehaviorSubject<User>(null);
    private refreshSubscription: Subscription = null;
    private notificationDeleted = new EventEmitter<void>();

    /**
     * The currently logged in user
     */
    public readonly currentUser: Observable<User> = this._currentUser
        .asObservable()
        .pipe(
            skip(1),
            // After that, replay the last submitted value to all subscribers
            shareReplay(1)
        );

    private readonly notificationResults: Observable<NotificationResults> = combineLatest(
        [this.currentUser, this.notificationDeleted.pipe(startWith({}))]
    ).pipe(
        switchMap(([user, _]) => {
            return timer(0, UserService.TEN_SECONDS).pipe(map(() => user));
        }),
        switchMap((user) => {
            if (!user) {
                return of([]);
            }

            const url = this.notificationUrl(user.uid);
            const query = this.api
                .queryBuilder(url)
                .get()
                .addJwtAuth(user.token)
                .build();

            return this.api.send(query, { skipLoading: true });
        }),
        map((response: NotificationResults) => {
            // API returns a timestamp string, so we need to convert to a date
            let notifications = [...response.notifications];
            notifications = notifications.map((n) => {
                return {
                    ...n,
                    createdAt: new Date(n.createdAt),
                };
            });
            return {
                count: response.count,
                notifications: notifications,
            };
        })
    );

    public readonly notifications: Observable<
        ApiUserNotification[]
    > = this.notificationResults.pipe(
        map((result) => result.notifications),
        shareReplay(1)
    );

    public readonly notificationCount: Observable<number> = this.notificationResults.pipe(
        map((result) => result.count),
        shareReplay(1)
    );

    /**
     * Profile data for the currently logged in user
     */
    public readonly profileData: Observable<UserProfileData> = this.currentUser.pipe(
        switchMap((userData) => {
            if (!userData) {
                return of(null);
            }

            const dataReq = this.api
                .queryBuilder(`${this.api.apiRoot()}/users/${userData.uid}`)
                .get()
                .addJwtAuth(userData.token)
                .build();

            return this.api.send(dataReq).pipe(
                catchError((e) => {
                    console.error(e);
                    return of(null);
                }),
                map((profileData) => plainToClass(UserProfileData, profileData))
            );
        }),
        shareReplay(1)
    );

    /**
     * Create a user object based on an ApiLoginResponse
     * @param jsonResponse The JSON returned from the API
     * @return User The parsed User
     * @private
     */
    private static userFromJwt(jsonResponse: ApiLoginResponse): User {
        if (jsonResponse === null) {
            return null;
        }
        const jwtData = jwtDecode(jsonResponse.accessToken) as Record<
            string,
            unknown
        >;
        return User.fromJSON({ ...jwtData, token: jsonResponse.accessToken });
    }

    constructor(
        private readonly alert: AlertService,
        private readonly api: ApiClientService,
        private readonly loading: LoadingService
    ) {}

    /**
     * Creates a new user
     * @param userData The fields for the user
     * @return Observable<User> The created user
     */
    create(userData: ApiCreateUserData): Observable<User> {
        const createReq = this.api
            .queryBuilder(this.usersUrl)
            .post()
            .body(userData)
            .build();

        return this.api.send(createReq).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.error && err.error.message) {
                    return of(`Account creation failed: ${err.error.message}`);
                }
                return of('Account creation failed');
            }),
            switchMap((userOrError: ApiUser | string) => {
                if (typeof userOrError !== 'string') {
                    this.alert.showMessage('Account created successfully');
                    return this.login(userData.username, userData.password);
                }
                return of(null);
            })
        );
    }

    /**
     * Log into the API
     * @return Observable<User> The logged in user
     */
    login(username: string, password: string): Observable<User> {
        this.loading.start();
        return this.authenticate(this.loginUrl, { username, password }).pipe(
            tap((userData) => this._currentUser.next(userData)),
            finalize(() => this.loading.end())
        );
    }

    /**
     * Log out from the API
     */
    logout(): void {
        const currentUser = this._currentUser.getValue();
        const logoutReq = this.api
            .queryBuilder(this.logoutUrl)
            .post()
            .addJwtAuth(currentUser.token)
            .build();

        this.loading.start();
        this.api
            .send(logoutReq)
            .pipe(
                tap(() => {
                    this._currentUser.next(null);
                }),
                finalize(() => {
                    this.loading.end();
                })
            )
            .subscribe();
    }

    /**
     * Refresh the current access token using a refresh cookie
     */
    refresh(): Observable<User> {
        return this.authenticate(this.refreshUrl, {}).pipe(
            tap((userData) => this._currentUser.next(userData))
        );
    }

    /**
     * Update the current user's profile via the API
     * @param profileData The profile data
     * @return Observable<UserProfileData> The updated profile data
     */
    saveProfile(profileData: UserProfileData): Observable<UserProfileData> {
        return this._currentUser.pipe(
            take(1),
            switchMap((userData) => {
                if (!userData) {
                    return null;
                }

                const dataReq = this.api
                    .queryBuilder(`${this.api.apiRoot()}/users/${userData.uid}`)
                    .patch()
                    .body(profileData)
                    .addJwtAuth(userData.token)
                    .build();

                return this.api.send(dataReq).pipe(
                    catchError((e: HttpErrorResponse) => {
                        this.alert.showError(
                            `An error occurred: ${e.error.message.join('\n')}`
                        );
                        return of(null);
                    }),
                    map((profileData) => {
                        if (profileData) {
                            this.alert.showMessage(
                                'Profile updated successfully'
                            );
                        }
                        return plainToClass(UserProfileData, profileData);
                    }),
                    tap(() => {
                        this.refresh().subscribe();
                    })
                );
            })
        );
    }

    /**
     * Change a password via the API
     * @param username The username whose password we're changing
     * @param newPassword The new password
     * @return Observable<string> An error, if any
     */
    changePassword(
        username: string,
        newPassword: string
    ): Observable<string | null> {
        return this.currentUser.pipe(
            take(1),
            filter((user) => user !== null),
            switchMap((user) => {
                const req = this.api
                    .queryBuilder(
                        `${this.api.apiRoot()}/users/${user.uid}/changePassword`
                    )
                    .patch()
                    .addJwtAuth(user.token)
                    .body({
                        username,
                        newPassword: newPassword,
                    })
                    .build();

                return this.api.send(req).pipe(
                    map(() => null),
                    catchError((err: HttpErrorResponse) => {
                        if (err.error && err.error.message) {
                            return of(err.error.message);
                        }
                        return of('Unknown error');
                    })
                );
            })
        );
    }

    /**
     * Authenticate with the API
     * @param url The url to authenticate against
     * @param authData A username and password
     * @private
     */
    private authenticate(url: string, authData: AuthData) {
        // Build a POST request to the given URL, with the given authData
        // as the body
        const authReq = this.api
            .queryBuilder<AuthData>(url)
            .post()
            .body(authData)
            .addCookieAuth()
            .build();

        return this.api
            .send<AuthData, User>(authReq, { skipLoading: true })
            .pipe(
                catchError((e) => {
                    console.error(e);
                    return of(null);
                }),
                map((jwtData) => {
                    // Parse the user from the returned JSON
                    const userData = UserService.userFromJwt(jwtData);

                    // Do refresh with cookie when five minutes remain
                    if (userData) {
                        const refreshIn =
                            userData.millisUntilExpires() -
                            UserService.ONE_MINUTE;
                        this.refreshSubscription = of(0)
                            .pipe(delay(refreshIn))
                            .subscribe(() => {
                                this.refresh().subscribe();
                            });
                    } else if (this.refreshSubscription !== null) {
                        this.refreshSubscription.unsubscribe();
                    }

                    return userData;
                })
            );
    }

    deleteNotification(id: number) {
        this.currentUser
            .pipe(
                take(1),
                map((user) => {
                    if (!user) {
                        throw new Error('Please log in');
                    }
                    return user;
                }),
                switchMap((user) => {
                    const url = `${this.notificationUrl(user.uid)}/${id}`;
                    const query = this.api
                        .queryBuilder(url)
                        .delete()
                        .addJwtAuth(user.token)
                        .build();

                    return this.api
                        .send(query, { skipLoading: true })
                        .pipe(map(() => null));
                }),
                catchError((e) => {
                    return of(e);
                })
            )
            .subscribe((err) => {
                if (err !== null) {
                    this.alert.showError(
                        `Error deleting notification: ${err.message}`
                    );
                } else {
                    this.notificationDeleted.emit();
                }
            });
    }

    deleteAllNotifications() {
        this.currentUser
            .pipe(
                take(1),
                map((user) => {
                    if (!user) {
                        throw new Error('Please log in');
                    }
                    return user;
                }),
                switchMap((user) => {
                    const url = this.notificationUrl(user.uid);
                    const query = this.api
                        .queryBuilder(url)
                        .delete()
                        .addJwtAuth(user.token)
                        .build();

                    return this.api
                        .send<unknown, { deleted: number }>(query, {
                            skipLoading: true,
                        })
                        .pipe(map((result) => result.deleted));
                }),
                catchError((e) => {
                    return of(e);
                })
            )
            .subscribe((errOrDeletedCount) => {
                if (errOrDeletedCount instanceof Error) {
                    this.alert.showError(
                        `Error deleting notification: ${errOrDeletedCount.message}`
                    );
                } else {
                    this.notificationDeleted.emit();
                    this.alert.showMessage(
                        `Cleared ${errOrDeletedCount} notifications`
                    );
                }
            });
    }

    getUsers(): Observable<UserOutputDto[]> {
        return this.currentUser.pipe(
            switchMap((currentUser) => {
                const url = `${this.usersUrl}`;
                console.log(url)
                const req = this.api
                    .queryBuilder(url)
                    .get()
                    .addJwtAuth(currentUser.token)
                    .build();

                return this.api.send(req).pipe(
                    map((users: UserOutputDto[]) => {
                        console.log(users);
                        return users;
                    })
                );
            })
        )
    }

    getUserById(uid: number): Observable<UserOutputDto> {
        return this.currentUser.pipe(
            map((currentUser) => {
                return currentUser.token;
            }),
            switchMap((token) => {
                const url = `${this.usersUrl}/${uid}`;
                console.log(url)
                const req = this.api
                    .queryBuilder(url)
                    .get()
                    .addJwtAuth(token)
                    .build();

                return this.api.send(req).pipe(
                    map((user: UserOutputDto) => {
                        console.log(user.username);
                        return user;
                    })
                );
            })
        );
    }

    private get loginUrl() {
        return `${this.api.apiRoot()}/auth/login`;
    }

    private get logoutUrl() {
        return `${this.api.apiRoot()}/auth/logout`;
    }

    private get refreshUrl() {
        return `${this.api.apiRoot()}/auth/refresh`;
    }

    private get usersUrl() {
        return `${this.api.apiRoot()}/users`;
    }

    private notificationUrl(uid: number) {
        return `${this.api.apiRoot()}/users/${uid}/notifications`;
    }
}
