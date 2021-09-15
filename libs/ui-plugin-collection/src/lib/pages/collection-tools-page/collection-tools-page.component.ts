import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { Collection, CollectionService } from '@symbiota2/ui-plugin-collection';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { CollectionEditorComponent } from '../../components/collection-editor/collection-editor.component';

@Component({
    selector: 'symbiota2-collection-tools-page',
    templateUrl: './collection-tools-page.component.html',
    styleUrls: ['./collection-tools-page.component.scss'],
})
export class CollectionToolsPage implements OnInit {
    private static readonly ROUTE_PARAM_COLLID = 'collectionID';

    private collectionTools: Map<string, Component> = new Map()
    .set("Edit Collection", CollectionEditorComponent);

    readonly collectionToolsKeys: String[] = Array.from(this.collectionTools.keys());

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
        this.validatePage().then((isValid) => {
          if(isValid){
            this.getCollection();
            console.log(this.collection);
            this.collectionToolsKeys ;
            console.log(this.collectionToolsKeys);
            
            this.selectedContent = this.collectionTools.get("Edit Collection");
            
          }
        });
    }

    setContentView(key: string): void{
        this.selectedContent = this.collectionTools.get(key);
    }

    private validatePage(): Promise<Boolean> {
        return this.currentRoute.paramMap
            .pipe(
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

                    return this.collections.currentCollection;
                }),
                tap((collection) => {
                    //confirm collection exists if not send user to root
                    if (collection === null) {
                        this.router.navigate(['']);
                        this.alerts.showError('Collection not found');
                    }
                }),
                switchMap((collection) => {
                    //grab result$ of if user can user can edit collection
                    return this.users.currentUser.pipe(
                        map((user) => {
                            if (!!user) {
                                return user.canEditCollection(collection.id);
                            } else {
                              return false;
                            }
                        })
                    );
                }),
                tap((bool) => {
                    // if they they do not have permission send them back to root if they do grab collection info.
                    if (bool != true) {
                        this.router.navigate(['']);
                        this.alerts.showError('Permission Denied');
                    }
                }),
                take(1)
            )
            .toPromise();
    }

    private getCollection(): void {
        this.collections.currentCollection.pipe().subscribe(col => this.collection = col);
    }

}
