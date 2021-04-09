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

@Injectable({
    providedIn: UserModule
})
export class UserService {
    private static readonly ONE_MINUTE = 60 * 1000;

    private readonly _currentUser = new BehaviorSubject<User>(null);
    private refreshSubscription: Subscription = null;

    // Skip the first, then share results to multiple subscribers, replaying
    // the 'current state'
    public readonly currentUser = this._currentUser.asObservable().pipe(
        skip(1),
        shareReplay(1)
    );

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

    login(username: string, password: string): Observable<User> {
        return this.authenticate(this.loginUrl, { username, password }).pipe(
            tap((userData) => this._currentUser.next(userData))
        );
    }

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

    refresh(): Observable<User> {
        return this.authenticate(this.refreshUrl, {}).pipe(
            tap((userData) => this._currentUser.next(userData))
        );
    }

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

    changePassword(uid: number, oldPassword: string, newPassword: string): Observable<string> {
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

    private authenticate(url: string, authData: AuthData) {
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
