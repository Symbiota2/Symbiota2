import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonListItem, TaxonomicStatusListItem,
    TaxonomicStatusService,
    TaxonService
} from '@symbiota2/ui-plugin-taxonomy';
import { ImageListItem, ImageService } from '@symbiota2/ui-plugin-image';

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
    selecetdFile : File
    imagePreview: string

    constructor(
        //private readonly userService: UserService,  // TODO: needed?
        private readonly taxonService: TaxonService,
        private readonly imageService: ImageService,
        private readonly taxonStatusService: TaxonomicStatusService,
        private router: Router,
        private formBuilder: FormBuilder,
        private currentRoute: ActivatedRoute
    ) { }

    /*
    Called when Angular starts
    */
    ngOnInit() {
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
}
