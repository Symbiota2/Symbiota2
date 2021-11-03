import { Route } from "@angular/router";
import { NavBarLink } from "./nav-bar-link.interface";
import { UserProfileTab } from "./user-profile-tab.interface";

export abstract class SymbiotaUiPlugin {
    static readonly PLUGIN_NAME: string;

    static routes(): Route[] {
        return [];
    }

    static navBarLinks(): NavBarLink[] {
        return [];
    }

    static userProfileTabs(): UserProfileTab[] {
        return [];
    }
}
