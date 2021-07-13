import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { CollectionService } from '../../services/collection.service';
import { Collection } from '../../dto/Collection.output.dto';
import {
    CollectionProfileLink,
    CollectionProfileService
} from '../../services/collection-profile.service';
import { MatDialog } from '@angular/material/dialog';
import {
    AlertService,
    UserService
} from '@symbiota2/ui-common';
import { DomSanitizer } from '@angular/platform-browser';
import { ROUTE_COLLECTION_LIST } from '../../routes';
import { CollectionEditorDialogComponent } from '../../components/collection-editor-dialog/collection-editor-dialog.component';

@Component({
    selector: 'symbiota2-collection-page',
    templateUrl: './collection-page.component.html',
    styleUrls: ['./collection-page.component.scss']
})
export class CollectionPage {
    private static readonly ROUTE_PARAM_COLLID = 'collectionID';
    private static readonly USER_COLLECTIONS_LINK: CollectionProfileLink = {
        text: 'Back to collections',
        requiresLogin: false,
        routerLink: `/${ROUTE_COLLECTION_LIST}`,
    };

    public collection = this.currentRoute.paramMap.pipe(
        map((params) => {
            return (
                params.has(CollectionPage.ROUTE_PARAM_COLLID) ?
                    parseInt(params.get(CollectionPage.ROUTE_PARAM_COLLID)) :
                    -1
            );
        }),
        switchMap((collectionID) => this.loadCollection(collectionID))
    );

    public links: Observable<CollectionProfileLink[]> = this.collection.pipe(
        switchMap((collection) => {
            return this.profileService.links(collection.id);
        }),
        map((links) => {
            return [
                CollectionPage.USER_COLLECTIONS_LINK,
                ...links
            ];
        })
    );

    public userCanEdit = combineLatest([
        this.userService.currentUser,
        this.collection
    ]).pipe(
        map(([user, collection]) => {
            return !!user && !!collection && user.canEditCollection(collection.id);
        })
    );

    public collectionHomePage = this.collection.pipe(
        map((collection) => {
            if (collection?.homePage) {
                return this.sanitizer.bypassSecurityTrustUrl(collection.homePage);
            }
            return null;
        })
    );

    public geoReferencedPercent = this.collection.pipe(
        map((collection) => {
            if (collection?.stats?.recordCount > 0) {
                return Math.round(collection.stats.georeferencedCount / collection.stats.recordCount * 100);
            }
            return 0;
        })
    );

    constructor(
        private readonly userService: UserService,
        private readonly collections: CollectionService,
        private readonly router: Router,
        private readonly alerts: AlertService,
        private readonly currentRoute: ActivatedRoute,
        private readonly profileService: CollectionProfileService,
        private readonly dialog: MatDialog,
        private readonly sanitizer: DomSanitizer) { }

    onEdit() {
        this.collection.pipe(
            filter((collection) => !!collection),
            take(1),
            switchMap((collection) => {
                const dialog = this.dialog.open(
                    CollectionEditorDialogComponent,
                    { data: collection, disableClose: true }
                );

                return combineLatest([
                    dialog.afterClosed(),
                    this.userService.currentUser
                ]).pipe(
                    take(1),
                    switchMap(([collectionData, currentUser]) => {
                        if (collectionData === null || currentUser === null) {
                            return null;
                        }
                        return this.collections.updateByID(
                            collectionData.id,
                            currentUser.token,
                            collectionData
                        );
                    })
                )
            })
        ).subscribe(() => {
            // TODO: This is a hack, we need to replace it with better state management in the collection service
            // Refresh the page
            const origReuseRoute = this.router.routeReuseStrategy.shouldReuseRoute;
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.navigate(['.'], { relativeTo: this.currentRoute });
            this.router.routeReuseStrategy.shouldReuseRoute = origReuseRoute;
        });
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
