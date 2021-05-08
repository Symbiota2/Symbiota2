import {
    Component,
    OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs/operators';
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
    User,
    UserService
} from '@symbiota2/ui-common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CollectionEditorComponent } from '../../components/collection-editor/collection-editor.component';
import { ROUTE_COLLECTION_LIST } from '../../routes';

@Component({
    selector: 'symbiota2-collection-page',
    templateUrl: './collection-page.component.html',
    styleUrls: ['./collection-page.component.scss']
})
export class CollectionPage implements OnInit {
    private static readonly ROUTE_PARAM_COLLID = 'collectionID';
    private static readonly USER_COLLECTIONS_LINK: CollectionProfileLink = {
        text: 'Back to collections',
        routerLink: `/${ROUTE_COLLECTION_LIST}`,
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
            map((params) => {
                return (
                    params.has(CollectionPage.ROUTE_PARAM_COLLID) ?
                        parseInt(params.get(CollectionPage.ROUTE_PARAM_COLLID)) :
                        -1
                );
            }),
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
        const dialog = this.dialog.open(
            CollectionEditorComponent,
            { data: this.collection }
        );

        combineLatest([
            dialog.afterClosed(),
            this.userService.currentUser
        ]).pipe(
            take(1),
            filter(([data, currentUser]) => {
                return data !== null && currentUser !== null;
            }),
            switchMap(([collectionData, currentUser]) => {
                return this.collections.updateByID(
                    this.collection.id,
                    currentUser.token,
                    collectionData
                );
            })
        ).subscribe((collection) => {
            this.collection = collection;
        });
    }

    collectionHomePage(): SafeUrl {
        if (this.collection?.homePage) {
            return this.sanitizer.bypassSecurityTrustUrl(this.collection.homePage);
        }
        return null;
    }

    georeferencedPercent(): number {
        if (this.collection?.stats?.recordCount > 0) {
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
