import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { User, UserProfileData } from "./dto/user.class";
import { ApiClientService } from "../api-client";
import { plainToClass } from "class-transformer";
import {
    catchError,
    delay,
    map,
    shareReplay,
    skip,
    switchMap, take,
    tap
} from 'rxjs/operators';
import { ApiLoginResponse } from "@symbiota2/data-access";
import { AlertService } from "../alert";
import { HttpErrorResponse } from "@angular/common/http";
import { UserModule } from "./user.module";
import jwtDecode from "jwt-decode";
import {
    ApiCreateUserData,
    ApiUser
} from '@symbiota2/data-access';

type AuthData = { username?: string, password?: string };

/**
 * Service for retrieving users from the API
 */
@Injectable()
export class UserService {
    private static readonly ONE_MINUTE = 60 * 1000;

    private readonly _currentUser = new BehaviorSubject<User>(null);
    private refreshSubscription: Subscription = null;

    /**
     * The currently logged in user
     */
    public readonly currentUser = this._currentUser.asObservable().pipe(skip(1));

    /**
     * Profile data for the currently logged in user
     */
    public readonly profileData: Observable<UserProfileData> = this.currentUser.pipe(
        switchMap((userData) => {
            if (!userData) {
                return of(null);
            }

            const dataReq = this.api.queryBuilder(`${this.api.apiRoot()}/users/${userData.uid}`)
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
        const jwtData = jwtDecode(jsonResponse.accessToken) as Record<string, unknown>;
        return User.fromJSON({ ...jwtData, token: jsonResponse.accessToken });
    }

    constructor(
        private readonly alert: AlertService,
        private readonly api: ApiClientService) { }

    /**
     * Creates a new user
     * @param userData The fields for the user
     * @return Observable<User> The created user
     */
    create(userData: ApiCreateUserData): Observable<User> {
        const createReq = this.api.queryBuilder(this.usersUrl)
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
        )
    }

    /**
     * Log into the API
     * @return Observable<User> The logged in user
     */
    login(username: string, password: string): Observable<User> {
        return this.authenticate(this.loginUrl, { username, password }).pipe(
            tap((userData) => this._currentUser.next(userData))
        );
    }

    /**
     * Log out from the API
     */
    logout(): void {
        const currentUser = this._currentUser.getValue();
        const logoutReq = this.api.queryBuilder(this.logoutUrl)
            .post()
            .addJwtAuth(currentUser.token)
            .build();

        this.api.send(logoutReq).pipe(tap(() => {
            this._currentUser.next(null);
        })).subscribe();
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

                const dataReq = this.api.queryBuilder(`${this.api.apiRoot()}/users/${userData.uid}`)
                    .patch()
                    .body(profileData)
                    .addJwtAuth(userData.token)
                    .build();

                return this.api.send(dataReq).pipe(
                    catchError((e: HttpErrorResponse) => {
                        this.alert.showError(`An error occurred: ${e.error.message.join('\n')}`);
                        return of(null);
                    }),
                    map((profileData) => {
                        if (profileData) {
                            this.alert.showMessage('Profile updated successfully');
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
     * @param uid The uid of the user whose password we're changing
     * @param oldPassword The old password
     * @param newPassword The new password
     * @return Observable<string> An error, if any
     */
    changePassword(uid: number, oldPassword: string, newPassword: string): Observable<string | null> {
        const req = this.api.queryBuilder(`${this.api.apiRoot()}/users/${uid}/changePassword`)
            .patch()
            .body({ oldPassword, newPassword })
            .build();

        return this.api.send(req).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.error && err.error.message) {
                    return of(err.error.message);
                }
                return of('Unknown error');
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
        const authReq = this.api.queryBuilder<AuthData>(url)
            .post()
            .body(authData)
            .addCookieAuth()
            .build();

        return this.api.send<AuthData, User>(authReq).pipe(
            catchError((e) => {
                console.error(e);
                return of(null);
            }),
            map((jwtData) => {
                // Parse the user from the returned JSON
                const userData = UserService.userFromJwt(jwtData);

                // Do refresh with cookie when five minutes remain
                if (userData) {
                    const refreshIn = userData.millisUntilExpires() - UserService.ONE_MINUTE;
                    this.refreshSubscription = of(0).pipe(delay(refreshIn)).subscribe(() => {
                        // TODO: Remove this
                        console.debug(`Refreshed at ${(new Date()).toLocaleTimeString()}`);
                        this.refresh().subscribe();
                    });
                }
                else if (this.refreshSubscription !== null) {
                    this.refreshSubscription.unsubscribe();
                }

                return userData;
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
}
