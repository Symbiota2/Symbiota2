import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { combineLatest, merge } from 'rxjs';
import { ImageFolderUploadService } from '../../services/imageFolderUpload/imageFolderUpload.service';
import { ImageService } from '@symbiota2/ui-plugin-image';
import { TAXA_UPLOAD_COMPLETE_ROUTE } from '../../../../../ui-plugin-taxonomy/src/lib/routes';
import { IMAGE_FOLDER_UPLOAD_COMPLETE_ROUTE } from '../../routes';

@Component({
    selector: 'image-folder-upload',
    templateUrl: './image-folder-upload-page.component.html',
    styleUrls: ['./image-folder-upload-page.component.scss']
})
export class ImageFolderUploadPage implements OnInit {
    private static readonly Q_PARAM_PAGE = 'page'
    taxonomicAuthorityID = 27 // Default set in nginit
    fileInput = new FormControl(null)
    userID : number = null
    userCanEdit: boolean = false

    constructor(
        private readonly userService: UserService,
        private readonly imageService: ImageService,
        private readonly uploadService: ImageFolderUploadService,
        private readonly alerts: AlertService,
        private readonly router: Router,
        private readonly currentRoute: ActivatedRoute) { }

    ngOnInit(): void {
        const qParams = this.currentRoute.snapshot.queryParamMap

        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditTaxon(user.uid)
            })
    }

    onUpload() {
        combineLatest([
            this.uploadService.uploadFile(this.fileInput.value).pipe(
                switchMap(() => this.uploadService.currentUpload)
            )
        ]).pipe(take(1)).subscribe(([beginUploadResponse]) => {
            if (beginUploadResponse !== null) {
                combineLatest([
                    this.uploadService.startUpload()
                ]).pipe(
                    take(1)
                ).subscribe(([authority,]) => {
                    this.router.navigate(
                        [IMAGE_FOLDER_UPLOAD_COMPLETE_ROUTE]
                    )
                })
            }
            else {
                this.alerts.showError('Upload failed')
            }
        })
    }
}
