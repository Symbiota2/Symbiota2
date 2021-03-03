import { Injectable } from "@angular/core";
import { Route, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { NavBarLink } from "./nav-bar-link.interface";
import { UserProfileTab } from "./user-profile-tab.interface";

@Injectable()
export class PluginService {
    private _navBarLinks = new BehaviorSubject<NavBarLink[]>([]);
    private _userProfileTabs = new BehaviorSubject<UserProfileTab[]>([]);

    navBarLinks$ = this._navBarLinks.asObservable().pipe(shareReplay(1));
    userProfileTabs$ = this._userProfileTabs.asObservable().pipe(shareReplay(1));

    constructor(private readonly router: Router) { }

    public putRoute(route: Route) {
        this.router.config = [...this.router.config, route];
    }

    public putNavBarLink(link: NavBarLink) {
        const currentLinks = this._navBarLinks.getValue();
        this._navBarLinks.next([...currentLinks, link]);
    }

    public putProfileTab(tab: UserProfileTab) {
        const currentTabs = this._userProfileTabs.getValue();
        this._userProfileTabs.next([...currentTabs, tab]);
    }
}
