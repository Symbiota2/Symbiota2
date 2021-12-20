import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { combineLatest, merge } from 'rxjs';
import { TaxonomicAuthorityService, TaxonService } from '@symbiota2/ui-plugin-taxonomy';
import { TaxonomyUploadService } from '../../services/taxonomyUpload/taxonomy-upload.service';
import { TAXA_UPLOADER_FIELD_MAP_ROUTE } from '../../routes';
import { Q_PARAM_AUTHORITYID } from '../../../constants';

@Component({
    selector: 'taxonomy-upload',
    templateUrl: './taxonomy-upload-page.component.html',
    styleUrls: ['./taxonomy-upload-page.component.scss']
})
export class TaxonomyUploadPage implements OnInit {
    private static readonly Q_PARAM_PAGE = 'page'
    taxonomicAuthorityID = 27 // Default set in nginit
    fileInput = new FormControl(null)
    userID : number = null
    userCanEdit: boolean = false

    constructor(
        private readonly userService: UserService,
        private readonly taxaService: TaxonService,
        private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
        private readonly alerts: AlertService,
        private readonly router: Router,
        private readonly currentRoute: ActivatedRoute,
        private readonly upload: TaxonomyUploadService) { }

    ngOnInit(): void {
        const qParams = this.currentRoute.snapshot.queryParamMap

        this.taxonomicAuthorityID = this.taxonomicAuthorityService.getAuthorityID()

        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditTaxon(user.uid)
            })
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
                    [TAXA_UPLOADER_FIELD_MAP_ROUTE],
                    {
                        queryParams: {
                            //[Q_PARAM_AUTHORITYID]: authorityID,
                            uploadID: beginUploadResponse.id
                        }
                    }
                )
            }
            else {
                this.alerts.showError('Upload failed')
            }
        })
    }
}
