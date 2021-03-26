import { NgModule } from "@angular/core";
import { RouterModule, Route } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { SitemapComponent } from "./pages/sitemap/sitemap.component";
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { CreateUserProfileComponent } from './pages/create-user-profile/create-user-profile.component';

const defaultRoutes: Route[] = [
    { path: HomeComponent.ROUTE, component: HomeComponent },
    { path: SitemapComponent.ROUTE, component: SitemapComponent },
    { path: UserProfileComponent.ROUTE, component: UserProfileComponent },
    { path: CreateUserProfileComponent.ROUTE, component: CreateUserProfileComponent },
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
