import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonDescriptionBlockListItem,
    TaxonDescriptionBlockService, TaxonListItem, TaxonomicStatusListItem, TaxonomicStatusService, TaxonService
} from '@symbiota2/ui-plugin-taxonomy';
import { ImageListItem, ImageService } from '@symbiota2/ui-plugin-image';

@Component({
    selector: 'taxon-profile',
    templateUrl: './taxon-profile-page.html',
    styleUrls: ['./taxon-profile-page.component.scss'],
})

export class TaxonProfilePageComponent implements OnInit {
    blocks: TaxonDescriptionBlockListItem[] = []
    taxonID: string
    image: ImageListItem
    images: ImageListItem[] = []
    taxon: TaxonListItem
    taxonomicStatus: TaxonomicStatusListItem

    constructor(
        //private readonly userService: UserService,  // TODO: needed for species hiding
        private readonly taxonDescriptionBlockService: TaxonDescriptionBlockService,
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
            this.taxonID = params.get('taxonID')
            // Load the profile
            this.loadProfile(parseInt(this.taxonID))
        })
    }

    /*
    Load the taxon profile
     */
    loadProfile(taxonID: number) {
        this.taxonDescriptionBlockService.findBlocksByTaxonID(taxonID).subscribe((blocks) => {
            blocks.forEach((block) => {
                if (block.descriptionStatements.length > 0) {
                    block.descriptionStatements = block.descriptionStatements.sort((a, b) => a.sortSequence - b.sortSequence)
                }
            })
            this.blocks = blocks
        })
        this.imageService.findByTaxonIDs([taxonID]).subscribe((images) => {
            this.image = images.shift()
            this.images = images
            //images.forEach((image) => {
            //})
        })
        this.taxonStatusService.findAll({taxonIDs : [taxonID], taxonomicAuthorityID: 1}).subscribe((taxonomicStatuses) => {
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
    }

    goToLink(url: string){
        window.open("taxon/editor/" + url, "_blank")
    }

    goToParent(url: string){
        window.open("taxon/profile/" + url)
    }
}
