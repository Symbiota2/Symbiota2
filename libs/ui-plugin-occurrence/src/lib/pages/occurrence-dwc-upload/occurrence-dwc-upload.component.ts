import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AlertService } from '@symbiota2/ui-common';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { ROUTE_UPLOAD_FIELD_MAP } from '../../routes';
import {
  CollectionService,
  ROUTE_COLLECTION_LIST
} from '@symbiota2/ui-plugin-collection';
import { Q_PARAM_COLLID } from '../../../constants';
import { OccurrenceUploadService } from '../../services/occurrence-upload.service';
import { combineLatest, merge } from 'rxjs';
@Component({
  selector: 'symbiota2-occurrence-dwc-upload',
  templateUrl: './occurrence-dwc-upload.component.html',
  styleUrls: ['./occurrence-dwc-upload.component.scss']
})
export class OccurrenceDwcUploadPage implements OnInit {
  private static readonly Q_PARAM_PAGE = 'page';

  collectionID = this.collections.currentCollection.pipe(
    tap((collection) => {
      if (!collection) {
        this.alerts.showError('Collection not found');
        this.router.navigate([ROUTE_COLLECTION_LIST]);
      }
    }),
    map((collection) => collection.id)
  );

  fileInput = new FormControl(null);
  currentPage = this.currentRoute.queryParamMap.pipe(
    map((params) => {
      const hasPage = params.has(OccurrenceDwcUploadPage.Q_PARAM_PAGE);
      return hasPage ? parseInt(params.get(OccurrenceDwcUploadPage.Q_PARAM_PAGE)) : 0;
    })
  );

  constructor(
    readonly collections: CollectionService,
    private readonly alerts: AlertService,
    private readonly router: Router,
    private readonly currentRoute: ActivatedRoute,
    private readonly upload: OccurrenceUploadService) { }

  ngOnInit(): void {
    const qParams = this.currentRoute.snapshot.queryParamMap;
    let collID;

    if (qParams.has(Q_PARAM_COLLID)) {
      collID = parseInt(qParams.get(Q_PARAM_COLLID));
      collID = Number.isInteger(collID) ? collID : null;
    }

    this.collections.setCollectionID(collID);
  }

  onUpload() {
    combineLatest([
      this.collectionID,
      this.upload.uploadFile(this.fileInput.value).pipe(
        switchMap(() => this.upload.currentUpload)
      )
    ]).pipe(take(1)).subscribe(([collectionID, beginUploadResponse]) => {
      if (beginUploadResponse !== null) {
        this.router.navigate(
          [ROUTE_UPLOAD_FIELD_MAP],
          {
            queryParams: {
              [Q_PARAM_COLLID]: collectionID,
              uploadID: beginUploadResponse.id
            }
          }
        );
      }
      else {
        this.alerts.showError('Upload failed');
      }
    });
  }

}
