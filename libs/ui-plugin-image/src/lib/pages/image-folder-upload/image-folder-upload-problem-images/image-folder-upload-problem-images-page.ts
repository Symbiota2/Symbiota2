import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ImageService
} from '../../../services';


@Component({
    selector: 'image-folder-upload-problem-images',
    templateUrl: './image-folder-upload-problem-images-page.html',
    styleUrls: ['./image-folder-upload-problem-images-page.scss'],
})

export class ImageFolderUploadProblemImagesPage implements OnInit {

    names = []

    constructor(
        private readonly imageService: ImageService,
    ) {

    }

    /*
    Called when Angular starts
     */
    ngOnInit() {
        //this.taxaService.getProblemAcceptedNames().subscribe((names) => {
        //    this.names = names
        //})

    }

}
