import { Observable, of } from 'rxjs';
import { CollectionCategory } from '../dto/Category.output.dto';
import {
    ApiClientService,
} from "@symbiota2/ui-common";
import { catchError, map } from 'rxjs/operators';
import { Collection } from '../dto/Collection.output.dto';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { CollectionInputDto } from '../dto/Collection.input.dto';

interface FindAllParams {
    limit: number;
}

@Injectable()
export class CollectionService {
    private static readonly COLLECTION_BASE_URL = "collections";
    private static readonly CATEGORY_BASE_URL = `${CollectionService.COLLECTION_BASE_URL}/categories`;

    constructor(private readonly api: ApiClientService) {}

    private get baseUrl() {
        return `${this.api.apiRoot()}/${CollectionService.COLLECTION_BASE_URL}`;
    }

    categories(): Observable<CollectionCategory[]> {
        const catUrl = `${this.api.apiRoot()}/${CollectionService.CATEGORY_BASE_URL}`;

        const req = this.api.queryBuilder(catUrl)
            .get()
            .build();

        return this.api.send(req).pipe(
            map((categoryJsonLst: Record<string, unknown>[]) => {
                return categoryJsonLst.map((cat) => {
                    return new CollectionCategory(cat);
                });
            })
        );
    }

    findAll(findAllParams?: FindAllParams): Observable<Collection[]> {
        const req = this.api.queryBuilder(this.baseUrl).get().build();
        return this.api.send(req).pipe(
            catchError((e) => {
                console.error(e);
                return of([]);
            }),
            map((collections: Record<string, unknown>[]) => {
                return collections.map((collection) => new Collection(collection));
            })
        );
    }

    findByID(id: number): Observable<Collection> {
        const url = `${this.baseUrl}/${id}`;
        const req = this.api.queryBuilder(url).get().build();

        return this.api.send(req).pipe(
            catchError((e) => {
                console.error(e);
                return of(null);
            }),
            map((collection: Record<string, unknown>) => {
                return new Collection(collection);
            })
        );
    }

    findByIDs(ids: number[]): Observable<Collection[]> {
        if (ids.length === 0) {
            return of([]);
        }

        const url = new URL(this.baseUrl);
        const qParams = new HttpParams(
            { fromObject: { id: ids.map((id) => id.toString()) } }
        );

        const req = this.api.queryBuilder(`${url}?${qParams.toString()}`)
            .get()
            .build();

        return this.api.send(req).pipe(
            catchError((e) => {
                console.error(e);
                return of([]);
            }),
            map((collections: Record<string, unknown>[]) => {
                return collections.map((c) => new Collection(c));
            })
        );
    }

    updateByID(id: number, collectionData: Partial<CollectionInputDto>): Observable<Collection> {
        const url = `${this.baseUrl}/${id}`;
        const req = this.api.queryBuilder(url)
            .patch()
            .body(collectionData)
            .build();

        console.log(collectionData);

        return this.api.send(req).pipe(
            catchError((e) => {
                console.error(e);
                return of(null);
            }),
            map((collection: Record<string, unknown>) => {
                if (collection !== null) {
                    return new Collection(collection);
                }
                return null;
            })
        );
    }
}
