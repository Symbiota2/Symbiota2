import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonDescriptionBlockService,
    TaxonomicAuthorityService,
    TaxonomicStatusService,
    TaxonService,
    TaxonVernacularService,
} from '../../services';
import { TaxonDescriptionBlockListItem } from '../../dto';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'taxon-editor',
    templateUrl: './taxon-editor-page.html',
    styleUrls: ['./taxon-editor-page.component.scss'],
})
export class TaxonEditorPageComponent implements OnInit {
    // Which taxon am I editing?
    taxonID: string;
    // Bound information about the taxon
    taxon;
    // The scientific name of the taxon, initially "unknown"
    taxonName = 'unknown';
    taxonAuthor = 'unknown';
    // The description of the taxon
    blocks: TaxonDescriptionBlockListItem[] = [];

    constructor(
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
    ) {}

    /*
    Called when Angular starts
     */
    ngOnInit() {
        this.currentRoute.paramMap.subscribe((params) => {
            this.taxonID = params.get('taxonID');
            // Load the profile
            this.loadProfile(parseInt(this.taxonID));
        });
    }

    /*
    Load the taxon profile
    */
    loadProfile(taxonID: number) {
        this.taxaService.findByID(taxonID).subscribe((taxon) => {
            console.log(taxon);
            this.taxon = taxon;
            this.taxonName = taxon.scientificName;
            this.taxonAuthor = taxon.author;
        });
        this.taxonDescriptionBlockService
            .findBlocksByTaxonID(taxonID)
            .subscribe((blocks) => {
                blocks.forEach((block) => {
                    if (block.descriptionStatements.length > 0) {
                        block.descriptionStatements = block.descriptionStatements.sort(
                            (a, b) => a.sortSequence - b.sortSequence
                        );
                    }
                });
                this.blocks = blocks;
            });
    }
}
