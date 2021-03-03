import { Route } from "@angular/router";
import { NavBarLink } from "./nav-bar-link.interface";
import { UserProfileTab } from "./user-profile-tab.interface";

export abstract class SymbiotaPlugin {
    static getRoutes(): Route[] {
        return [];
    }

    static getNavBarLinks(): NavBarLink[] {
        return [];
    }

    static getUserProfileTabs(): UserProfileTab[] {
        return [];
    }
}
