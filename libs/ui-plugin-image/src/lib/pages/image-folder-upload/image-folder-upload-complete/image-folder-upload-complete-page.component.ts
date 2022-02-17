import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ImageService
} from '../../../services';
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'image-folder-upload-complete',
    templateUrl: './image-folder-upload-complete-page.component.html',
    styleUrls: ['./image-folder-upload-complete-page.component.scss'],
})

export class ImageFolderUploadCompletePage implements OnInit {
    public done = false
    public someSkipped = false
    public skippedImagesDueToProblems = null

    constructor(
        private readonly imageService: ImageService,
        public dialog: MatDialog
    ) {

    }

    /*
    Called when Angular starts
     */
    ngOnInit() {

    }

    // Called when the process finishes
    onSubmit() {
        this.imageService.getProblemUploadFolderImages().subscribe((rowsList) => {
            this.skippedImagesDueToProblems = rowsList[0]

            if (this.skippedImagesDueToProblems.length > 0) {
                this.someSkipped = true
            }
            this.done = true
        })
    }

}
