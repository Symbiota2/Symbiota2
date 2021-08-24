import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { Collection } from '../../dto/Collection.output.dto';
import { CollectionService } from "../../services/collection.service";
import { AlertService } from '@symbiota2/ui-common';
import { PageEvent } from '@angular/material/paginator';
import { UserService } from '@symbiota2/ui-common';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'symbiota2-collection-comment-page',
    templateUrl: './collection-comment-page.component.html',
    styleUrls: ['./collection-comment-page.component.scss'],
})
export class CollectionCommentPage implements OnInit {
    public collection: Collection;

    public comments: number[] = [1, 1, 1 ,1 ,1 ,1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,];
    public commentSlice = this.comments.slice(0, 5);

    constructor(
        private readonly rt: Router,
        private readonly activeRoute: ActivatedRoute,
        private readonly collections: CollectionService,
        private readonly alerts: AlertService,
        private readonly user: UserService
    ) {}

    ngOnInit(): void {
        this.getCollection();
        //this.getCollectionComments(this.collection.id);
    }

    private getCollection() {
        this.activeRoute.paramMap.pipe(map((params) => parseInt(params.get('collectionID'))), tap(collectionID => {
          this.collections.setCollectionID(collectionID);
        }),
        switchMap(() => {
          return this.collections.currentCollection;
        })).subscribe(collection => this.collection = collection);
    }

    private getCollectionsComments(){
      
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
      let endIndex = startIndex + e.pageSize
      if (endIndex > this.comments.length){
        endIndex = this.comments.length;
      }
      this.commentSlice = this.comments.slice(startIndex, endIndex);
  }
}
