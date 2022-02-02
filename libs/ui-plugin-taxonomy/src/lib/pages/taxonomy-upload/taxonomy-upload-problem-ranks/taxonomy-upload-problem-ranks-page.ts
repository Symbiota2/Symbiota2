import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonService
} from '../../../services';
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';


@Component({
    selector: 'taxonomy-upload-problem-ranks',
    templateUrl: './taxonomy-upload-problem-ranks-page.html',
    styleUrls: ['./taxonomy-upload-problem-ranks-page.scss'],
})

export class TaxonomyUploadProblemRanksPage implements OnInit {

    names = []

    constructor(
        private readonly taxaService: TaxonService,
    ) {

    }

    /*
    Called when Angular starts
     */
    ngOnInit() {
        this.taxaService.getProblemAcceptedNames().subscribe((names) => {
            this.names = names
        })

    }

}
