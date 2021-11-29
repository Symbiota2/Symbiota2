import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AlertService } from '@symbiota2/ui-common';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { combineLatest, merge } from 'rxjs';
import { TaxonService } from '@symbiota2/ui-plugin-taxonomy';
import { TaxonomyUploadService } from '../../services/taxonomyUpload/taxonomy-upload.service';
import { ROUTE_UPLOAD_FIELD_MAP } from '../../routes';
import { Q_PARAM_AUTHORITYID } from '../../../constants';

@Component({
    selector: 'taxonomy-upload',
    templateUrl: './taxonomy-upload-page.component.html',
    styleUrls: ['./taxonomy-upload-page.component.scss']
})
export class TaxonomyUploadPage implements OnInit {
    private static readonly Q_PARAM_PAGE = 'page'
    taxonomicAuthorityID = 27
    fileInput = new FormControl(null)

    constructor(
        readonly taxaService: TaxonService,
        private readonly alerts: AlertService,
        private readonly router: Router,
        private readonly currentRoute: ActivatedRoute,
        private readonly upload: TaxonomyUploadService) { }

    ngOnInit(): void {
        const qParams = this.currentRoute.snapshot.queryParamMap;
    }

    onUpload() {
        combineLatest([
            //this.taxonomicAuthorityID,
            this.upload.uploadFile(this.fileInput.value).pipe(
                switchMap(() => this.upload.currentUpload)
            )
        ]).pipe(take(1)).subscribe(([beginUploadResponse]) => {
        //]).pipe(take(1)).subscribe(([authorityID, beginUploadResponse]) => {
            if (beginUploadResponse !== null) {
                this.router.navigate(
                    [ROUTE_UPLOAD_FIELD_MAP],
                    {
                        queryParams: {
                            //[Q_PARAM_AUTHORITYID]: authorityID,
                            uploadID: beginUploadResponse.id
                        }
                    }
                );
            }
            else {
                this.alerts.showError('Upload failed')
            }
        })
    }
}
