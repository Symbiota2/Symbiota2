import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CollectionService } from '../../services/collection.service';
import { Collection } from '../../dto/Collection.output.dto';
import {
    CollectionProfileLink,
    CollectionProfileService
} from '../../services/collection-profile.service';
import { MatDialog } from '@angular/material/dialog';
import { CollectionEditorComponent } from '../collection-editor/collection-editor.component';
import { AlertService, User, UserService } from '@symbiota2/ui-common';
import { CollectionInputDto } from '../../dto/Collection.input.dto';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'lib-collection-page',
    templateUrl: './collection-page.component.html',
    styleUrls: ['./collection-page.component.scss']
})
export class CollectionPage implements OnInit {
    private static USER_COLLECTIONS_LINK: CollectionProfileLink = {
        text: 'Back to collections',
        routerLink: '/viewprofile',
        queryParams: { tab: 3 }
    };

    public collection: Collection = null;
    public links: CollectionProfileLink[] = [];
    public currentUser: User = null;

    constructor(
        private readonly userService: UserService,
        private readonly collections: CollectionService,
        private readonly router: Router,
        private readonly alerts: AlertService,
        private readonly currentRoute: ActivatedRoute,
        private readonly profileService: CollectionProfileService,
        private readonly dialog: MatDialog,
        private readonly sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        this.currentRoute.paramMap.pipe(
            map((params) => params.has('id') ? parseInt(params.get('id')) : -1),
            switchMap((collectionID) => this.loadCollection(collectionID)),
            switchMap((collection) => {
                this.collection = collection;
                return this.profileService.links(collection.id);
            })
        ).subscribe((links) => {
            this.links = [
                CollectionPage.USER_COLLECTIONS_LINK,
                ...links
            ];
        });

        this.userService.currentUser.subscribe((user) => {
            this.currentUser = user;
        });
    }

    onEdit() {
        const dialogRef = this.dialog.open(
            CollectionEditorComponent,
            { data: this.collection, disableClose: true }
        );
        dialogRef.afterClosed().subscribe((collectionData) => {
            if (collectionData) {
                collectionData = CollectionInputDto.fromFormData(collectionData);
                this.collections.updateByID(this.collection.id, collectionData)
                    .subscribe((updatedCollection) => {
                        if (updatedCollection === null) {
                            this.alerts.showError('Error updating collection');
                            this.router.navigate(
                                [CollectionPage.USER_COLLECTIONS_LINK.routerLink],
                                { queryParams: CollectionPage.USER_COLLECTIONS_LINK.queryParams }
                            );
                        }
                        else {
                            this.collection = updatedCollection;
                        }
                    });
            }
        });
    }

    collectionHomePage(): SafeUrl {
        if (!!this.collection.homePage) {
            return this.sanitizer.bypassSecurityTrustUrl(this.collection.homePage);
        }
        return null;
    }

    georeferencedPercent(): number {
        if (this.collection.stats.recordCount > 0) {
            return Math.round(this.collection.stats.georeferencedCount / this.collection.stats.recordCount * 100);
        }
        return 0;
    }

    private loadCollection(id: number): Observable<Collection> {
        if (id === -1 || Number.isNaN(id)) {
            this.router.navigate(["/"]);
            return of(null);
        }
        else {
            return this.collections.findByID(id);
        }
    }
}
