import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonDescriptionBlockListItem, TaxonDescriptionBlockService,
    TaxonomicAuthorityService,
    TaxonomicStatusService,
    TaxonService, TaxonVernacularService
} from '@symbiota2/ui-plugin-taxonomy';
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector: 'taxonomy-upload-complete',
    templateUrl: './taxonomy-upload-complete-page.component.html',
    styleUrls: ['./taxonomy-upload-complete-page.component.scss'],
})

export class TaxonomyUploadCompletePage implements OnInit {
    public done = false
    public someSkipped = false
    public skippedTaxonsDueToMultipleMatch = null
    public skippedTaxonsDueToMismatchRank = null
    public skippedTaxonsDueToMissingName= null

    // list of all the updates to do to status records
    public skippedStatusesDueToMultipleMatch = null
    public skippedStatusesDueToAcceptedMismatch = null
    public skippedStatusesDueToParentMismatch = null
    public skippedStatusesDueToTaxonMismatch = null

    constructor(
        //private readonly userService: UserService,  // TODO: needed for species hiding
        private readonly taxaService: TaxonService,
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

    }

    // Called when the process finishes
    onSubmit() {
        this.taxaService.getProblemUploadRows().subscribe((rowsList) => {
            this.skippedTaxonsDueToMultipleMatch = rowsList[0]
            this.skippedTaxonsDueToMismatchRank = rowsList[1]
            this.skippedTaxonsDueToMissingName= rowsList[2]

            // list of all the updates to do to status records
            this.skippedStatusesDueToMultipleMatch = rowsList[3]
            this.skippedStatusesDueToAcceptedMismatch = rowsList[4]
            this.skippedStatusesDueToParentMismatch = rowsList[5]
            this.skippedStatusesDueToTaxonMismatch = rowsList[6]

            if (this.skippedTaxonsDueToMultipleMatch.length > 0
                || this.skippedTaxonsDueToMismatchRank.length > 0
                || this.skippedTaxonsDueToMissingName.length > 0
                || this.skippedStatusesDueToMultipleMatch.length > 0
                || this.skippedStatusesDueToAcceptedMismatch.length > 0
                || this.skippedStatusesDueToParentMismatch.length > 0
                || this.skippedStatusesDueToTaxonMismatch.length > 0
            ) {
                this.someSkipped = true
            }
            this.done = true
        })
    }

}
