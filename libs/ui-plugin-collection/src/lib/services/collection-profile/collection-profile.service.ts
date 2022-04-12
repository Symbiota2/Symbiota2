import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { Params } from '@angular/router';
import { UserService } from '@symbiota2/ui-common';

export interface CollectionProfileLink {
    text: string;
    routerLink: string;
    requiresLogin: boolean;
    queryParams?: Params | null;
}

type CollectionProfileLinkFactory = (collectionID: number) => CollectionProfileLink;

@Injectable()
export class CollectionProfileService {
    private _profileLinks = new BehaviorSubject<(CollectionProfileLink | CollectionProfileLinkFactory)[]>([]);

    _links = this._profileLinks.asObservable();

    constructor(private readonly user: UserService) { }

    links(collectionID: number): Observable<CollectionProfileLink[]> {
        return this.user.currentUser.pipe(
            switchMap((user) => {
                return this._links.pipe(
                    map((links) => {
                        return links.map((link) => {
                            if (typeof link === 'function') {
                                return link(collectionID);
                            }
                            return link;
                        });
                    }),
                    map((links) => {
                        return links.filter((link) => {
                            if (!link.requiresLogin) {
                                return true;
                            }

                            return (
                                link.requiresLogin &&
                                user !== null &&
                                user.canEditCollection(collectionID)
                            );
                        })
                    })
                )
            })
        );
    }

    putLink(link: CollectionProfileLink | CollectionProfileLinkFactory) {
        const currentLinks = this._profileLinks.getValue();
        this._profileLinks.next([...currentLinks, link]);
    }
}
