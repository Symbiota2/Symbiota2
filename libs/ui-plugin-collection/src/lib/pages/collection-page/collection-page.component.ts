import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { CollectionService } from '../../services/collection.service';
import {
    CollectionProfileLink,
    CollectionProfileService,
} from '../../services/collection-profile.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { DomSanitizer } from '@angular/platform-browser';
import {
    ROUTE_COLLECTION_LIST,
    ROUTE_COLLECTION_COMMENTS,
    ROUTE_COLLECTION_TOOLS,
} from '../../routes';
import { CollectionEditorDialogComponent } from '../../components/collection-editor-dialog/collection-editor-dialog.component';
import { Collection } from '@symbiota2/ui-plugin-collection';

@Component({
    selector: 'symbiota2-collection-page',
    templateUrl: './collection-page.component.html',
    styleUrls: ['./collection-page.component.scss'],
})
export class CollectionPage implements OnInit {
    private static readonly ROUTE_PARAM_COLLID = 'collectionID';
    private static readonly USER_COLLECTIONS_LINK: CollectionProfileLink = {
        text: 'Back to collections',
        requiresLogin: false,
        routerLink: `/${ROUTE_COLLECTION_LIST}`,
    };

    public collection: Collection;

    private collectionID: number;

    private comments_link: CollectionProfileLink;

    public links: CollectionProfileLink[];

    public userCanEdit: boolean;

    public collectionHomePage: string;

    public geoReferencedPercent;

    constructor(
        private readonly userService: UserService,
        private readonly collections: CollectionService,
        private readonly router: Router,
        private readonly alerts: AlertService,
        private readonly currentRoute: ActivatedRoute,
        private readonly profileService: CollectionProfileService,
        private readonly dialog: MatDialog,
        private readonly sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        this.getCollection().then((data) => {
            this.collection = data;
            this.collectionHomePage = data.homePage;
            this.geoReferencedPercent =
                data.collectionStats != null && data.collectionStats.recordCount > 0
                    ? Math.round(
                          (data.collectionStats.georeferencedCount /
                              data.collectionStats.recordCount) *
                              100
                      )
                    : 0;
            this.collectionID = data.id;
            this.canUserEdit();
            this.comments_link = {
                text: 'view comments',
                requiresLogin: false,
                routerLink: `/${ROUTE_COLLECTION_COMMENTS.replace(
                    ':collectionID',
                    this.collectionID.toString()
                )}`,
            };
            this.getLinks();
            console.log('subscribe: ' + data);
        });
    }

    getCollection(): Promise<Collection> {
        return this.currentRoute.paramMap
            .pipe(
                map((params) => {
                    return params.has(CollectionPage.ROUTE_PARAM_COLLID)
                        ? parseInt(
                              params.get(CollectionPage.ROUTE_PARAM_COLLID)
                          )
                        : -1;
                }),
                switchMap((collectionID) => {
                    this.collections.setCollectionID(collectionID);

                    return this.collections.currentCollection;
                }),
                tap((collection) => {
                    if (collection === null) {
                        this.router.navigate(['']);
                        this.alerts.showError('Collection not found');
                    }
                }),
                take(1) //had to add this to get promise to resolve
            )
            .toPromise();
    }

    getLinks(): void {
        this.collections.currentCollection
            .pipe(
                switchMap((collection) => {
                    return this.profileService.links(collection.id);
                }),
                map((links) => {
                    return [
                        CollectionPage.USER_COLLECTIONS_LINK,
                        ...links,
                        this.comments_link,
                    ];
                })
            )
            .subscribe((links) => (this.links = links));
    }

    canUserEdit() {
        combineLatest([
            this.userService.currentUser,
            this.collections.currentCollection,
        ])
            .pipe(
                map(([user, collection]) => {
                    return (
                        !!user &&
                        !!collection &&
                        user.canEditCollection(collection.id)
                    );
                })
            )
            .subscribe((b) => (this.userCanEdit = b));
    }

    isUserEditor(): Promise<boolean> {
        return this.userService.currentUser
            .pipe(
                map((user) => {
                    return user.canEditCollection(this.collectionID);
                }),
                take(1)
            )
            .toPromise();
    }

    openCollectionTools(): void {
        var route: string = `/${ROUTE_COLLECTION_TOOLS.replace(
            ':collectionID',
            this.collectionID.toString()
        )}`;

        console.log(route);
        this.isUserEditor().then((bool) => {
            if (bool) {
                this.router.navigate([route]);
            }
        });
    }

    // onEdit() {
    //     this.collection
    //         .pipe(
    //             filter((collection) => collection !== null),
    //             take(1),
    //             switchMap((collection) => {
    //                 const dialog = this.dialog.open(
    //                     CollectionEditorDialogComponent,
    //                     { data: collection, disableClose: true }
    //                 );

    //                 return dialog.afterClosed().pipe(
    //                     take(1),
    //                     map((collectionData) => {
    //                         if (collectionData !== null) {
    //                             return this.collections.updateCurrentCollection(
    //                                 collectionData
    //                             );
    //                         }
    //                     })
    //                 );
    //             })
    //         )
    //         .subscribe();
    // }
}
