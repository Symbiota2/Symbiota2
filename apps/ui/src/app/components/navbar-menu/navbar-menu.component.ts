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

    isStringURL(testString: string): boolean {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return !!pattern.test(testString);
    }
}
