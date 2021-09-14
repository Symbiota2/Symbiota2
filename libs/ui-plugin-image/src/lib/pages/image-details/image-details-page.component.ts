import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonListItem, TaxonomicStatusListItem,
    TaxonomicStatusService,
    TaxonService
} from '@symbiota2/ui-plugin-taxonomy';
import { TaxonIDAndNameItem } from '../../../../../ui-plugin-taxonomy/src/lib/dto/taxon-id-and-name-item';
import { ImageListItem, ImageService } from '@symbiota2/ui-plugin-image';

@Component({
    selector: 'image-details',
    templateUrl: './image-details-page.html',
    styleUrls: ['./image-details-page.component.scss'],
})

export class ImageDetailsPageComponent implements OnInit {
    imageID: string
    image: ImageListItem
    taxon: TaxonListItem
    taxonomicStatus: TaxonomicStatusListItem

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
        this.currentRoute.paramMap.subscribe(params => {
            this.imageID = params.get('imageID')
            // Load the profile
            this.loadImage(parseInt(this.imageID))
        })
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
