import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
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
    selector: 'symbiota2-upload',
    templateUrl: './occurrence-upload-page.component.html',
    styleUrls: ['./occurrence-upload-page.component.scss']
})
export class OccurrenceUploadPage implements OnInit {
    private static readonly Q_PARAM_PAGE = 'page';

    uploadOption: "csv" | "zip" | "link" = "link"

    linkEnabled = true;
    uploadZipEnabled = false;
    uploadCsvEnabled = false;

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
    dwcaLink = new FormControl(null);
    currentPage = this.currentRoute.queryParamMap.pipe(
        map((params) => {
            const hasPage = params.has(OccurrenceUploadPage.Q_PARAM_PAGE);
            return hasPage ? parseInt(params.get(OccurrenceUploadPage.Q_PARAM_PAGE)) : 0;
        })
    );

    constructor(
        readonly collections: CollectionService,
        private readonly alerts: AlertService,
        private readonly router: Router,
        private readonly currentRoute: ActivatedRoute,
        private readonly upload: OccurrenceUploadService,
        private fb: FormBuilder) { }

    uploadDwcForm = this.fb.group({
        uploadOption: ['link'],
    })


    ngOnInit(): void {
        const qParams = this.currentRoute.snapshot.queryParamMap;
        let collID;

        if (qParams.has(Q_PARAM_COLLID)) {
            collID = parseInt(qParams.get(Q_PARAM_COLLID));
            collID = Number.isInteger(collID) ? collID : null;
        }

        this.collections.setCollectionID(collID);

        // listen to instOption to toggle inst select/create disabled status
        this.uploadDwcForm
            .get('uploadOption')
            .valueChanges.subscribe((option) => this.onToggleUploadOption(option));
        // setting default toggle to select institution
        this.onToggleUploadOption('link');
    }

    //Getting dwca from link
    onLinking() {

    }

    //Uploading dwca
    onUploadDwca() {
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

    //Uploading only a csv file.
    onUploadCsv() {
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

    onToggleUploadOption(option: 'link' | 'zip' | 'csv') {
        if (option == 'link') {
            this.linkEnabled = true;
            this.uploadZipEnabled = false;
            this.uploadCsvEnabled = false;
        }
        else if (option == 'zip') {
            this.linkEnabled = false;
            this.uploadZipEnabled = true;
            this.uploadCsvEnabled = false;
        }
        else if (option == 'csv') {
            this.linkEnabled = false;
            this.uploadZipEnabled = false;
            this.uploadCsvEnabled = true;
        }
    }
}
