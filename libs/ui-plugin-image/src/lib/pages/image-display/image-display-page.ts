import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonomicStatusService,
    TaxonService
} from '../../../../../ui-plugin-taxonomy/src/lib/services';
import { TaxonListItem, TaxonomicStatusListItem } from '../../../../../ui-plugin-taxonomy/src/lib/dto';
import { ImageService } from '../../services';
import { ImageListItem } from '../../dto';
// import * as fs from 'fs'
import { Express } from 'express';
//import * as fs from 'fs';
//type File = Express.Multer.File

@Component({
    selector: 'image-display',
    templateUrl: './image-display-page.html',
    styleUrls: ['./image-display-page.scss'],
})

export class ImageDisplayPage implements OnInit {
    imageID: string
    image: ImageListItem
    taxon: TaxonListItem
    taxonomicStatus: TaxonomicStatusListItem
    selecetdFile
    imagePreview

    constructor(
        //private readonly userService: UserService,  // TODO: needed?
        private readonly taxonService: TaxonService,
        private readonly imageService: ImageService,
        private readonly taxonStatusService: TaxonomicStatusService,
        private router: Router,
        private formBuilder: FormBuilder,
        // @Inject(IMAGES_PATH) public imagesPath: string,
        private currentRoute: ActivatedRoute
    ) { }

    /*
    Called when Angular starts
    */
    ngOnInit() {
        this.selecetdFile = "data/logo_green.png"//
        //const readStream = fs.createReadStream(this.selecetdFile)
        //let base64Image = new Buffer(readStream.read(), 'binary').toString('base64');
        //this.imagePreview = `data:image/logo_green.png;base64,${base64Image}`;

        /*
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
        };
        //reader.readAsDataURL(this.selecetdFile);
        reader.readAsDataURL(readStream)

         */
        /*
        //this.selecetdFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
        };
        reader.readAsDataURL(this.selecetdFile);

         */
    }

    /*
    Load the image details
    */
    loadImage(imageID: number) {
        this.imageService.findByID(imageID).subscribe((image) => {
            this.image = image
            this.taxonStatusService.findAll({taxonIDs : [this.image.taxonID], taxonomicAuthorityID: 1}).subscribe((taxonomicStatuses) => {
                let authoritySet = false
                taxonomicStatuses.forEach((taxonomicStatus) => {
                    if (!authoritySet) {
                        this.taxonomicStatus = taxonomicStatus
                        this.taxon = taxonomicStatus.taxon
                    }
                    if (taxonomicStatus.taxonID == taxonomicStatus.taxonIDAccepted) {
                        authoritySet = true
                    }
                })
            })
        })
     }

    goToLink(url: string){
        window.open("taxon/editor/" + url, "_blank");
    }


    onFileUpload(event){
        this.selecetdFile = "data/logo_green.png"//
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
        };
        reader.readAsDataURL(this.selecetdFile);
    }
}
