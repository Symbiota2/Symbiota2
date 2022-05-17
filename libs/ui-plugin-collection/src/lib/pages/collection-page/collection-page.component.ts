import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    catchError,
    filter,
    first,
    map,
    switchMap,
    take,
    tap,
} from 'rxjs/operators';
import {
    combineLatest,
    forkJoin,
    Observable,
    of,
    Subscription,
    throwError,
} from 'rxjs';
import { CollectionService } from '../../services/collection.service';
import {
    CollectionProfileLink,
    CollectionProfileService,
} from '../../services/collection-profile.service';
import { AlertService, UserService } from '@symbiota2/ui-common';
import {
    ROUTE_COLLECTION_LIST,
    ROUTE_COLLECTION_COMMENTS,
    ROUTE_COLLECTION_TOOLS,
} from '../../routes';
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

    public collection$: Observable<Collection>;

    private subscriptions: Subscription = new Subscription();

    private comments_link: CollectionProfileLink;

    public links$: Observable<CollectionProfileLink[]>;

    public geoReferencedPercent: number;

    public isColAdmin: boolean = false;

    constructor(
        private readonly userService: UserService,
        private readonly collections: CollectionService,
        private readonly router: Router,
        private readonly alerts: AlertService,
        private readonly currentRoute: ActivatedRoute,
        private readonly profileService: CollectionProfileService
    ) { }

    ngOnInit(): void {
        this.collection$ = this.getCollection();

        this.subscriptions.add(
            this.collection$.subscribe((collection) => {
                this.geoReferencedPercent =
                    collection.collectionStats != null &&
                        collection.collectionStats.recordCount > 0
                        ? Math.round(
                            (collection.collectionStats.georeferencedCount /
                                collection.collectionStats.recordCount) *
                            100
                        )
                        : 0;

                //TODO: replace this comment link
                this.comments_link = {
                    text: 'View comments',
                    requiresLogin: false,
                    routerLink: `/${ROUTE_COLLECTION_COMMENTS.replace(
                        ':collectionID',
                        collection.id.toString()
                    )}`,
                };

                this.links$ = this.getLinks();

                this.canUserEdit()
                    .subscribe((bool) => (this.isColAdmin = bool));
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getCollection(): Observable<Collection> {
        return this.currentRoute.paramMap.pipe(
            take(1),
            map((params) => {
                return params.has(CollectionPage.ROUTE_PARAM_COLLID)
                    ? parseInt(params.get(CollectionPage.ROUTE_PARAM_COLLID))
                    : -1;
            }),
            switchMap((collectionID) => {
                this.collections.setCollectionID(collectionID);

                return this.collections.currentCollection.pipe(
                    filter((collection) => collection.id == collectionID)
                );
            }),
            tap((collection) => {
                if (collection === null) {
                    this.router.navigate(['']);
                    this.alerts.showError('Collection not found');
                }
            })
        );
    }

    getLinks(): Observable<CollectionProfileLink[]> {
        return this.collections.currentCollection.pipe(
            take(1),
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
        );
    }

    private canUserEdit(): Observable<boolean> {
        return combineLatest([
            this.userService.currentUser,
            this.collections.currentCollection,
        ]).pipe(
            map(([user, collection]) => {
                return (
                    !!user &&
                    !!collection &&
                    user.canEditCollection(collection.id)
                );
            })
        );
    }

    openCollectionTools(): void {
        this.collection$
            .subscribe((collection) => {
                var route: string = `/${ROUTE_COLLECTION_TOOLS.replace(
                    ':collectionID',
                    collection.id.toString()
                )}`;

                this.router.navigate([route]);
            })
            .unsubscribe();
    }
}
