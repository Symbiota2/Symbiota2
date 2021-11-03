import { Component, Input, OnInit } from '@angular/core';
import { NavBarLink } from '@symbiota2/ui-common';

@Component({
    selector: 'symbiota2-navbar-menu',
    templateUrl: './navbar-menu.component.html',
    styleUrls: ['./navbar-menu.component.scss']
})
export class NavbarMenuComponent {
    @Input() title: string;
    @Input() items: NavBarLink[];
}
