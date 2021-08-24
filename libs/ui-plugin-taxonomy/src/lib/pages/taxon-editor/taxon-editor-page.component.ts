import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonDescriptionBlockListItem, TaxonDescriptionBlockService,
    TaxonListItem, TaxonomicAuthorityService,
    TaxonomicStatusService,
    TaxonService, TaxonVernacularListItem, TaxonVernacularService
} from '@symbiota2/ui-plugin-taxonomy';
import { TaxonomicEnumTreeService } from '@symbiota2/ui-plugin-taxonomy'
import { TranslateService } from '@ngx-translate/core'
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TaxonVernacularEditorComponent } from '../../components';

@Component({
    selector: 'taxon-editor',
    templateUrl: './taxon-editor-page.html',
    styleUrls: ['./taxon-editor-page.component.scss'],
})

export class TaxonEditorPageComponent implements OnInit {
    private taxonID: string
    blocks: TaxonDescriptionBlockListItem[] =[]

    constructor(
        //private readonly userService: UserService,  // TODO: needed for species hiding
        private readonly taxaService: TaxonService,
        private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        private readonly taxonomicStatusService: TaxonomicStatusService,
        private readonly taxonVernacularService: TaxonVernacularService,
        private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
        private readonly taxonDescriptionBlockService: TaxonDescriptionBlockService,
        private router: Router,
        private formBuilder: FormBuilder,
        private currentRoute: ActivatedRoute,
        private readonly translate: TranslateService,
        public dialog: MatDialog
    ) {

    }

    /*
    Called when Angular starts
     */
    ngOnInit() {

        console.log("loading ")
        this.currentRoute.paramMap.subscribe(params => {
            this.taxonID = params.get('taxonID')
            console.log("t " + this.taxonID)
            // Load the profile
            this.loadProfile(parseInt(this.taxonID))
        })

    }

    /*
Load the taxon profile
 */
    loadProfile(taxonID: number) {
        console.log(" here ")
        this.taxonDescriptionBlockService.findBlocksByTaxonID(taxonID).subscribe((blocks) => {

            console.log(" blocks " + blocks.length)
            blocks.forEach((block) => {
                if (block.descriptionStatements.length > 0) {
                    block.descriptionStatements = block.descriptionStatements.sort((a, b) => a.sortSequence - b.sortSequence)
                }
            })
            this.blocks = blocks
        })
    }
}
