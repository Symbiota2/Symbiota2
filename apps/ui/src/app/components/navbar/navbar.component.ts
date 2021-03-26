import {
    Component,
    OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
    AlertService,
    User,
    UserService,
    PluginService,
    NavBarLink
} from '@symbiota2/ui-common';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from '../login-dialog/login-dialog.component';
import { Router } from '@angular/router';
import { HomeComponent } from '../../pages/home/home.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { CreateUserProfileComponent } from '../../pages/create-user-profile/create-user-profile.component';
import { SitemapComponent } from '../../pages/sitemap/sitemap.component';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    user: User = null;
    navigationData: any;
    pluginLinks: NavBarLink[] = [];

    readonly ROUTE_HOME = HomeComponent.ROUTE;
    readonly ROUTE_PROFILE = UserProfileComponent.ROUTE;
    readonly ROUTE_CREATE_PROFILE = CreateUserProfileComponent.ROUTE;
    readonly ROUTE_SITEMAP = SitemapComponent.ROUTE;

    constructor(
        private readonly userService: UserService,
        private readonly alertService: AlertService,
        private readonly dialog: MatDialog,
        private readonly translate: TranslateService,
        private readonly plugins: PluginService,
        private readonly router: Router) { }

    ngOnInit() {
        this.userService.currentUser.subscribe((userData) => {
            this.user = userData;
        });

        this.plugins.navBarLinks$.subscribe((links) => {
            this.pluginLinks = links;
        });
    }

    onLogin() {
        this.dialog.open(LoginDialog, { disableClose: true });
    }

    onLogout() {
        this.router.navigate(['.']).then(() => {
            this.userService.logout();
        });
    }

    useLanguage(event): void {
        this.translate.use(event.value);
    }

    get currentLang(): string {
        return this.translate.currentLang;
    }
}
