import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
    AlertService,
    User,
    UserService,
    PluginService,
    NavBarLink,
    ROUTE_USER_PROFILE,
    ROUTE_USER_CREATE,
    ROUTE_SITEMAP,
} from '@symbiota2/ui-common';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from '../login-dialog/login-dialog.component';
import { Router } from '@angular/router';
import { HomePage } from '../../pages/home/home.component';
import { ApiUserNotification } from '@symbiota2/data-access';
import { NotificationDialog } from './notification-dialog/notification-dialog.component';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { customLinksEnd, customLinksStart, superAdminLinks } from './custom-navbarlinks';

@Component({
    selector: 'symbiota2-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    isHandset$: Observable<boolean> = this.breakpointObserver
        .observe([Breakpoints.Small, Breakpoints.Handset])
        .pipe(
            map((result) => result.matches),
            shareReplay()
        );

    navigationData: any;

    pluginLinks$ = this.plugins.navBarLinks$;
    currentUser$ = this.userService.currentUser;
    notifications$ = this.userService.notifications;
    notificationCount$ = this.userService.notificationCount;

    readonly ROUTE_HOME = HomePage.ROUTE;
    readonly ROUTE_PROFILE = ROUTE_USER_PROFILE;
    readonly ROUTE_CREATE_PROFILE = ROUTE_USER_CREATE;

    searchMenu: NavBarLink;
    toolMenu: NavBarLink;
    user: User;
    isSuperAdmin: Boolean;

    constructor(
        private readonly userService: UserService,
        private readonly alertService: AlertService,
        private readonly dialog: MatDialog,
        private readonly translate: TranslateService,
        private readonly plugins: PluginService,
        private readonly router: Router,
        private readonly breakpointObserver: BreakpointObserver
    ) { }

    ngOnInit(): void {
        //Check if superAdmin
        this.currentUser$.subscribe(res => {
            this.user = res;
            if (this.user && res.isSuperAdmin()) {
                // create new categories
                this.pluginLinks$ = this.pluginLinks$.pipe(
                    map((navMap: Map<string, NavBarLink[]>) => {
                        //add custom navbar elements
                        return new Map<string, NavBarLink[]>([
                            ...customLinksStart.entries(),
                            ...navMap.entries(),
                            ...customLinksEnd.entries(),
                            ...superAdminLinks.entries(),
                        ]);
                    })
                );
            }
            else {
                // create new categories
                this.pluginLinks$ = this.pluginLinks$.pipe(
                    map((navMap: Map<string, NavBarLink[]>) => {
                        //add custom navbar elements
                        return new Map<string, NavBarLink[]>([
                            ...customLinksStart.entries(),
                            ...navMap.entries(),
                            ...customLinksEnd.entries(),
                        ]);
                    })
                );
            }
            // get plugin categories
            this.linkCategories().subscribe((categories) => {
                // get category links
            });
        });

        /* // create new categories
         this.pluginLinks$ = this.pluginLinks$.pipe(
             map((navMap: Map<string, NavBarLink[]>) => {
                 //add custom navbar elements
                 return new Map<string, NavBarLink[]>([
                     ...customLinksStart.entries(),
                     ...navMap.entries(),
                     ...customLinksEnd.entries(),
                 ]);
             })
         );
 
         // get plugin categories
         this.linkCategories().subscribe((categories) => {
             // get category links
         });*/



        // add plugin links to new categories links in a easy to customize way
    }

    linkCategories(): Observable<string[]> {
        return this.pluginLinks$.pipe(map((pls) => [...pls.keys()]));
    }

    categoryLinks(category: string): Observable<NavBarLink[]> {
        return this.pluginLinks$.pipe(map((pls) => pls.get(category)));
    }

    isToday(date: Date) {
        const today = new Date();
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    }

    onLogin() {
        this.dialog.open(LoginDialog, { disableClose: true });
    }

    onLogout() {
        this.router.navigate(['.']).then(() => {
            this.userService.logout();
        });
    }

    onNotificationClicked(notification: ApiUserNotification) {
        const notificationDialog = this.dialog.open(NotificationDialog, {
            minWidth: '25%',
            minHeight: '25%',
            maxWidth: '75%',
            maxHeight: '75%',
            disableClose: true,
            data: notification,
        });

        notificationDialog.afterClosed().subscribe((shouldDelete) => {
            if (shouldDelete) {
                this.userService.deleteNotification(notification.id);
            }
        });
    }

    useLanguage(language: string) {
        this.translate.use(language);
    }

    clearNotifications() {
        this.userService.deleteAllNotifications();
    }

    get currentLang(): string {
        return this.translate.currentLang;
    }
}
