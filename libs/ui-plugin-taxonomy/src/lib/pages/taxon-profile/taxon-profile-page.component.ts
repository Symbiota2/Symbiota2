import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonDescriptionBlockListItem,
    TaxonDescriptionBlockService,
    TaxonDescriptionStatementListItem,
    TaxonDescriptionStatementService,
    TaxonListItem,
    TaxonomicStatusService,
    TaxonService, TaxonVernacularService
} from '@symbiota2/ui-plugin-taxonomy';
import { ImageListItem } from '../../../../../ui-plugin-image/src';

/**
 * Taxonomic data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface TaxonNode {
    name: string
    expanded?: boolean
    synonym?: boolean
    children?: TaxonNode[]
}

@Component({
    selector: 'taxon-profile',
    templateUrl: './taxon-profile-page.html',
    styleUrls: ['./taxon-profile-page.component.scss'],
})

export class TaxonProfilePageComponent implements OnInit {
    nameControl = new FormControl()

    private isLoading = false
    public readonly PAGE_SEARCH_CRITERIA = 0
    public readonly PAGE_SEARCH_RESULTS = 1
    public currentPage = this.PAGE_SEARCH_CRITERIA
    private taxon: TaxonListItem
    public descriptions: TaxonDescriptionStatementListItem[]
    public block: TaxonDescriptionBlockListItem
    public image: ImageListItem
    private taxonID: string

    constructor(
        //private readonly userService: UserService,  // TODO: needed for species hiding
        private readonly taxaService: TaxonService,
        private readonly taxonDescriptionBlockService: TaxonDescriptionBlockService,
        //private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        private readonly taxonomicStatusService: TaxonomicStatusService,
        private readonly taxonVernacularService: TaxonVernacularService,
        //private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
        private router: Router,
        private formBuilder: FormBuilder,
        private currentRoute: ActivatedRoute
    ) {

    }

    /*
    Called when Angular starts
     */
    ngOnInit() {

        this.currentRoute.paramMap.subscribe(params => {
            this.taxonID = params.get('taxonID')
        })

        console.log(" what " + this.taxonID)
        //this.taxonID = "93"
        // Load the authorities
        this.loadProfile(parseInt(this.taxonID))

    }

    /*
    Load the taxon profile
     */
    loadProfile(taxonID: number) {

        this.taxonDescriptionBlockService.findBlockByTaxonID(taxonID).subscribe((block) => {
            console.log("s is " + block.descriptionStatements.length)
            if (block.descriptionStatements.length > 0) {
                this.descriptions = block.descriptionStatements.sort((a,b) => a.sortSequence - b.sortSequence)
            } else {
                this.descriptions = [] // TODO set up a dummy record saying no description
            }
            this.block = block
            if (block.images.length > 0) {
                this.image = block.images[0]
            }
        })
    }


    /*
    Called when the taxon is chosen to display
     */
    onSubmit(): void {


    }

    /*
    Not used, probably can delete

    async onSwitchPage(page: number) {
        await this.router.navigate([], {
            relativeTo: this.currentRoute,
            queryParams: {
                page: page,
            },
        })
    }

     */

    /*
    Not used, probably can delete

    async onPrevious() {
        return this.onSwitchPage(this.currentPage - 1);
    }

     */

    /*
    Not used, probably can delete

    async onNext() {
        return this.onSwitchPage(this.currentPage + 1)
    }

     */
}
