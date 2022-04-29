import { NgModule } from "@angular/core";
import { RouterModule, Route } from "@angular/router";
import { HomePage } from "./pages/home/home.component";
import { UserProfilePage } from './pages/user-profile/user-profile.component';
import { CreateUserProfilePage } from './pages/create-user-profile/create-user-profile.component';
import {
    ROUTE_FORGOT_PASSWORD, ROUTE_FORGOT_USERNAME,
    ROUTE_SITEMAP,
    ROUTE_USER_LIST,
    ROUTE_USER_CREATE,
    ROUTE_USER_PROFILE
} from '@symbiota2/ui-common';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.component';
import { ForgotUsernamePage } from './pages/forgot-username/forgot-username.component';
import { UserlistPageComponent } from "./pages/userlist-page/userlist-page.component";

const defaultRoutes: Route[] = [
    { path: HomePage.ROUTE, component: HomePage },
    { path: ROUTE_USER_PROFILE, component: UserProfilePage },
    { path: ROUTE_USER_LIST, component: UserlistPageComponent },
    { path: ROUTE_USER_CREATE, component: CreateUserProfilePage },
    { path: ROUTE_FORGOT_PASSWORD, component: ForgotPasswordPage },
    { path: ROUTE_FORGOT_USERNAME, component: ForgotUsernamePage },
];

/**
 * Configures routing for the core of the UI. Additional (plugin) routes can be
 * added at runtime via the ui-common plugin.
 */
@NgModule({
    imports: [
        RouterModule.forRoot(
            defaultRoutes,
            {
                relativeLinkResolution: 'legacy',
                onSameUrlNavigation: 'reload',
                anchorScrolling: 'enabled'
            }
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
