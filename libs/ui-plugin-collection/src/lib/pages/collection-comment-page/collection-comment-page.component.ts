import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { Collection } from '../../dto/Collection.output.dto';
import { CollectionService } from '../../services/collection/collection.service';
import { AlertService } from '@symbiota2/ui-common';
import { PageEvent } from '@angular/material/paginator';
import { UserService } from '@symbiota2/ui-common';
import { filter } from 'rxjs/operators';
import { Comment } from '../../dto/Comment.output.dto';
import { CommentService } from '../../services/collection-comments/collection-comments.service';
import { Observable, Subscription } from 'rxjs';
import { once } from 'node:events';

@Component({
    selector: 'symbiota2-collection-comment-page',
    templateUrl: './collection-comment-page.component.html',
    styleUrls: ['./collection-comment-page.component.scss'],
})
export class CollectionCommentPage implements OnInit {
    private subscriptions: Subscription = new Subscription();

    public collection$: Observable<Collection>;

    public commentList: Comment[];
    public commentSlice: Comment[];

    constructor(
        private readonly rt: Router,
        private readonly activeRoute: ActivatedRoute,
        private readonly collections: CollectionService,
        private readonly alerts: AlertService,
        private readonly user: UserService,
        private readonly comments: CommentService
    ) {}

    ngOnInit(): void {
        //setting collection variable for html access
        this.collection$ = this.getCollection();

        //once collection is pulled from api pull said collections comments/set data reliant on collection
        this.subscriptions.add(this.collection$.pipe(
            map(collection => {

                //TODO: change to a function that pulls list of comments from api
                this.getCollectionComments().subscribe(comments => {
                    this.commentList = comments;
                    this.commentSlice = this.commentList.slice(0, 5);
                });
            })
        ).subscribe())
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getCollection(): Observable<Collection> {
        return this.activeRoute.paramMap
            .pipe(
                map((params) => parseInt(params.get('collectionID'))),
                tap((collectionID) => {
                    this.collections.setCollectionID(collectionID);
                }),
                switchMap(() => {
                    return this.collections.currentCollection;
                })
            );
    }

    //TODO: convert from mock data function into api call through a service
    private getCollectionComments( ): Observable<Comment[]> {
        return this.comments
            .getComments()
            .pipe(
                map((comments) => {
                    return comments;
                })
            );
    }

    isAdmin(): boolean {
        var result;

        this.user.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                result = user.isSuperAdmin();
            });

        return result;
    }

    onPageChanged(e: PageEvent) {
        const startIndex = e.pageIndex * e.pageSize;
        let endIndex = startIndex + e.pageSize;
        if (endIndex > this.commentList.length) {
            endIndex = this.commentList.length;
        }
        this.commentSlice = this.commentList.slice(startIndex, endIndex);
    }

    togglePublic(comment: Comment) {
        if (comment.public) {
            this.comments.setPublic(comment.commentID, 0);
        } else {
            this.comments.setPublic(comment.commentID, 1);
        }
    }

    toggleStatus(comment: Comment) {
        if (comment.status) {
            this.comments.setStatus(comment.commentID, 0);
        } else {
            this.comments.setStatus(comment.commentID, 1);
        }
    }

    deleteComment(comment: Comment) {
        //TODO: delete pop up
    }
}
