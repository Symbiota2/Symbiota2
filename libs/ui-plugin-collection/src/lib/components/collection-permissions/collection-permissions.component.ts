import { Component, OnInit } from '@angular/core';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
    Collection,
    CollectionListItem,
} from '../../dto/Collection.output.dto';
import { CollectionService } from '../../services/collection.service';

@Component({
    selector: 'symbiota2-collection-permissions',
    templateUrl: './collection-permissions.component.html',
    styleUrls: ['./collection-permissions.component.scss'],
})
export class CollectionPermissionsComponent implements OnInit {
    admins: string[];
    editors: string[];
    rareSpeciesReaders: string[];

    collection: Collection;

    constructor(
        readonly collections: CollectionService,
        readonly users: UserService,
        readonly alerts: AlertService
    ) {}

    ngOnInit(): void {
        this.getCollection().subscribe((col) => {
            this.collection = col;
            this.admins = ["bob", "dave", "mary"];
            this.editors = ["edward"];
        });
    }

    getCollection(): Observable<Collection> {
        return this.collections.currentCollection.pipe(
            map((collection) => {
                return collection;
            }),
        );
    }
}
