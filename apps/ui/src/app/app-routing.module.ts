import { NgModule } from "@angular/core";
import { RouterModule, Route, Router } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { SitemapComponent } from "./pages/sitemap/sitemap.component";
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

const defaultRoutes: Route[] = [
    { path: "", component: HomeComponent },
    { path: "sitemap", component: SitemapComponent },
    { path: "viewprofile", component: UserProfileComponent },
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
