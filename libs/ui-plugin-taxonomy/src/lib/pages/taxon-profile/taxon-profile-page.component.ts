import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonDescriptionBlockService, TaxonomicStatusService, TaxonService
} from '../../services';
import {
    TaxonDescriptionBlockListItem,
    TaxonListItem, TaxonomicStatusListItem
} from '../../dto';
import { ImageListItem } from '../../../../../ui-plugin-image/src/lib/dto';
import { ImageService } from '../../../../../ui-plugin-image/src/lib/services';
import { filter } from 'rxjs/operators';
import { UserService } from '@symbiota2/ui-common';
import { TAXON_EDITOR_ROUTE_PREFIX, TAXON_PROFILE_ROUTE_PREFIX } from '../../routes';

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
    taxonName = "unknown"
    taxonomicStatus: TaxonomicStatusListItem
    userID : number = null
    userCanEdit: boolean = false

    constructor(
        private readonly userService: UserService,
        private readonly taxaService: TaxonService,
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

        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditTaxonProfile(user.uid)
            })
    }

    /*
      Load the taxon profile
     */
    loadProfile(taxonID: number) {
        this.taxaService.findByID(taxonID).subscribe((taxon) => {
            this.taxon = taxon
            this.taxonName = taxon.scientificName
        })
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
        window.open(TAXON_EDITOR_ROUTE_PREFIX + "/" + url)
    }

    goToParent(url: string){
        window.open(TAXON_PROFILE_ROUTE_PREFIX + "/" + url)
    }
}
