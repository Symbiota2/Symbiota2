import { Injectable } from "@angular/core";
import { Route, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { NavBarLink } from "./nav-bar-link.interface";
import { UserProfileTab } from "./user-profile-tab.interface";

@Injectable()
export class PluginService {
    private _navBarLinks = new BehaviorSubject<Map<string, NavBarLink[]>>(new Map());
    private _userProfileTabs = new BehaviorSubject<UserProfileTab[]>([]);

    navBarLinks$ = this._navBarLinks.asObservable().pipe(shareReplay(1));
    userProfileTabs$ = this._userProfileTabs.asObservable().pipe(shareReplay(1));

    constructor(private readonly router: Router) { }

    public putRoute(route: Route) {
        this.router.config = [...this.router.config, route];
    }

    public putNavBarLink(category: string, link: NavBarLink) {
        const linkMap = new Map(this._navBarLinks.getValue());
        if (!linkMap.has(category)) {
            linkMap.set(category, []);
        }
        const linkList = [
            ...linkMap.get(category),
            link
        ];
        linkMap.set(category, linkList);
        this._navBarLinks.next(linkMap);
    }

    public putProfileTab(category: string, tab: UserProfileTab) {
        const currentTabs = this._userProfileTabs.getValue();
        this._userProfileTabs.next([...currentTabs, tab]);
    }
}
