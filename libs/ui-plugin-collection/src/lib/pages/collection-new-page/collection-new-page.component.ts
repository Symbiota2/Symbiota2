import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '@symbiota2/ui-common';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ROUTE_COLLECTION_LIST } from '../../routes';

@Component({
    selector: 'symbiota2-collection-new-page',
    templateUrl: './collection-new-page.component.html',
    styleUrls: ['./collection-new-page.component.scss'],
})
export class CollectionNewPage implements OnInit {
    constructor(
        private readonly user: UserService,
        private readonly rt: Router
    ) {}

    ngOnInit(): void {
        this.user.currentUser
            .subscribe((user) => {
                if (user == null || !user.isSuperAdmin()) {
                    this.rt.navigate(['/' + ROUTE_COLLECTION_LIST]);
                }
            })
            .unsubscribe();
    }
}
