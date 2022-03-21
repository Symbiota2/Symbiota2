import { Component, OnInit } from '@angular/core';
import { NavBarLink, PluginService, UserService } from '@symbiota2/ui-common';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { customLinksEnd, customLinksStart, superAdminLinks } from '../navbar/custom-navbarlinks';


@Component({
    selector: 'symbiota2-sitemap',
    templateUrl: './sitemap.component.html',
    styleUrls: ['./sitemap.component.scss']
})
export class Sitemap implements OnInit {
    categories$: Observable<string[]>;
    displayAdminLinks = superAdminLinks.entries();
    constructor(private readonly plugins: PluginService, private readonly userService: UserService) { }
    pluginLinks$ = this.plugins.navBarLinks$;

    ngOnInit(): void {
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

        this.pluginLinks$.subscribe((pluginLinks) => {
            this.categories$ = this.getCategories();
        });

    }

    getCategories(): Observable<string[]> {
        return this.pluginLinks$.pipe(map((pls) => [...pls.keys()]));
    }

    getCategoryLinks(category: string): Observable<NavBarLink[]> {
        return this.pluginLinks$.pipe(map((pls) => pls.get(category)));
    }

    isSuperAdmin(): Observable<Boolean> {
        return this.userService.currentUser.pipe(
            map((user) => user.isSuperAdmin())
        );
    }


}
