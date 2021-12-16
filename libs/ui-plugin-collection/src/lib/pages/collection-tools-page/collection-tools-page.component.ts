import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { Collection, CollectionService } from '@symbiota2/ui-plugin-collection';
import { Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { CollectionEditorComponent } from '../../components/collection-editor/collection-editor.component';
import { CollectionPermissionsComponent } from '../../components/collection-permissions/collection-permissions.component';
import { DwcPublishingComponent } from '../../components/dwc-publishing/dwc-publishing.component';

@Component({
    selector: 'symbiota2-collection-tools-page',
    templateUrl: './collection-tools-page.component.html',
    styleUrls: ['./collection-tools-page.component.scss'],
})
export class CollectionToolsPage implements OnInit {
    private static readonly ROUTE_PARAM_COLLID = 'collectionID';


    static collectionTools: Map<string, Component> = new Map()
        .set('Edit Collection', CollectionEditorComponent)
        .set('User Permissions', CollectionPermissionsComponent)
        .set('DarwinCore Archive Publishing', DwcPublishingComponent);

    readonly collectionToolsKeys: String[] = Array.from(
        CollectionToolsPage.collectionTools.keys()
    );

    //TODO: rework into observable
    selectedContent: Component;

    collection: Collection;

    constructor(
        private readonly users: UserService,
        private readonly collections: CollectionService,
        private readonly currentRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly alerts: AlertService
    ) {}

    ngOnInit(): void {
        this.validateCollection().subscribe((collection) => {
            if (!!collection) {
                this.collection = collection;
                this.selectedContent = CollectionToolsPage.collectionTools.get(
                    'Edit Collection'
                );
            }
        });

    }


    setContentView(key: string): void {
        this.selectedContent = CollectionToolsPage.collectionTools.get(key);
    }

    private validateCollection(): Observable<Collection> {
        return this.currentRoute.paramMap.pipe(
            take(1),
            map((params) => {
                //confirm collection id in url is valid
                return params.has(CollectionToolsPage.ROUTE_PARAM_COLLID)
                    ? parseInt(
                          params.get(CollectionToolsPage.ROUTE_PARAM_COLLID)
                      )
                    : -1;
            }),
            switchMap((collectionID) => {
                //grab collection$ based on id
                this.collections.setCollectionID(collectionID);
        
                return this.collections.currentCollection.pipe(take(1));
            }),
            tap((collection) => {
                //confirm collection exists if not send user to root
                if (collection === null) {
                    this.router.navigate(['']);
                    this.alerts.showError('Collection not found');
                }
            }),
            switchMap((collection) => {
                //return collection if user can edit collection
                return this.users.currentUser.pipe(
                    map((user) => {
                        if (!!user && user.canEditCollection(collection.id)) {
                            return collection;
                        } else {
                            return null;
                        }
                    })
                );
            }),
            tap((collection) => {
                // if they they do not have permission send them back to root if they do grab collection info.
                if (collection === null) {
                    this.router.navigate(['']);
                    this.alerts.showError('Permission Denied');
                }
            })
        );
    }
}
