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

}
