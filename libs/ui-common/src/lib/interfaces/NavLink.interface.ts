export interface NavLink {
    name: string;
    path: string;
    component: any;
}

export interface NavLinkProvider {
    navLinks(): NavLink[];
}

export interface ProfileLinkProvider {
    profileLinks(): NavLink[];
}
