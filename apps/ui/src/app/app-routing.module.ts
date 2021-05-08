import { NgModule } from "@angular/core";
import { RouterModule, Route } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { SitemapComponent } from "./pages/sitemap/sitemap.component";
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { CreateUserProfileComponent } from './pages/create-user-profile/create-user-profile.component';
import {
    ROUTE_SITEMAP,
    ROUTE_USER_CREATE,
    ROUTE_USER_PROFILE
} from '@symbiota2/ui-common';

const defaultRoutes: Route[] = [
    { path: HomeComponent.ROUTE, component: HomeComponent },
    { path: ROUTE_SITEMAP, component: SitemapComponent },
    { path: ROUTE_USER_PROFILE, component: UserProfileComponent },
    { path: ROUTE_USER_CREATE, component: CreateUserProfileComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            defaultRoutes,
            {
                relativeLinkResolution: 'legacy',
                onSameUrlNavigation: 'reload'
            }
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
