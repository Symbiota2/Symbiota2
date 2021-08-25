import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { Collection } from '../../dto/Collection.output.dto';
import { CollectionService } from '../../services/collection.service';
import { AlertService } from '@symbiota2/ui-common';
import { PageEvent } from '@angular/material/paginator';
import { UserService } from '@symbiota2/ui-common';
import { filter } from 'rxjs/operators';
import { Comment } from '../../dto/Comment.output.dto';
import { CommentService } from '../../services/comments.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'symbiota2-collection-comment-page',
    templateUrl: './collection-comment-page.component.html',
    styleUrls: ['./collection-comment-page.component.scss'],
})
export class CollectionCommentPage implements OnInit {
    public collection: Collection;

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
        this.getCollection();
        this.getCollectionComments();
        //this.getCollectionComments(this.collection.id);
    }

    private getCollection() {
        this.activeRoute.paramMap
            .pipe(
                map((params) => parseInt(params.get('collectionID'))),
                tap((collectionID) => {
                    this.collections.setCollectionID(collectionID);
                }),
                switchMap(() => {
                    return this.collections.currentCollection;
                })
            )
            .subscribe((collection) => (this.collection = collection));
    }

    private getCollectionComments() {
        this.comments
            .getComments()
            .pipe(
                map((comments) => {
                    return comments;
                })
            )
            .subscribe((comments) => (this.commentList = comments));

        this.commentSlice = this.commentList.slice(0, 5);
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
