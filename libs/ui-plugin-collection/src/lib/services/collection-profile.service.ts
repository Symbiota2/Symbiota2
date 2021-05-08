import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Params } from '@angular/router';

export interface CollectionProfileLink {
    text: string;
    routerLink: string;
    queryParams?: Params | null;
}

type CollectionProfileLinkFactory = (collectionID: number) => CollectionProfileLink;

@Injectable()
export class CollectionProfileService {
    private _profileLinks = new BehaviorSubject<(CollectionProfileLink | CollectionProfileLinkFactory)[]>([]);

    // TODO: Do we need the shareReplay pipe?
    _links = this._profileLinks.asObservable().pipe(shareReplay(1));

    constructor() { }

    links(collectionID: number): Observable<CollectionProfileLink[]> {
        return this._links.pipe(
            map((links) => {
                return links.map((link) => {
                    if (typeof link === 'function') {
                        return link(collectionID);
                    }
                    return link;
                });
            })
        );
    }

    putLink(link: CollectionProfileLink | CollectionProfileLinkFactory) {
        const currentLinks = this._profileLinks.getValue();
        this._profileLinks.next([...currentLinks, link]);
    }
}
