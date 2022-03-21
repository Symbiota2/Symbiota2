import { Component, OnInit } from '@angular/core';
import { NavBarLink, PluginService } from '@symbiota2/ui-common';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

/**
 * TODO: Do we need a sitemap? It's 2022 :-D
 */
@Component({
    selector: 'symbiota2-sitemap',
    templateUrl: './sitemap.component.html',
    styleUrls: ['./sitemap.component.scss']
})
export class Sitemap implements OnInit {
    categories$: Observable<string[]>;
    constructor(private readonly plugins: PluginService) { }
    pluginLinks$ = this.plugins.navBarLinks$;

    ngOnInit(): void {
        this.categories$ = this.getCategories();
    }

    getCategories(): Observable<string[]> {
        return this.pluginLinks$.pipe(map((pls) => [...pls.keys()]));
    }

    getCategoryLinks(category: string): Observable<NavBarLink[]> {
        return this.pluginLinks$.pipe(map((pls) => pls.get(category)));
    }

}
