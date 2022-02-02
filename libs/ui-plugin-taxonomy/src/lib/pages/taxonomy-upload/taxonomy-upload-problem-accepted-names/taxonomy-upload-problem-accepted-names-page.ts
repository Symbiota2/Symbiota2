import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonService
} from '../../../services';
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector: 'taxonomy-upload-problem-accepted-names',
    templateUrl: './taxonomy-upload-problem-accepted-names-page.html',
    styleUrls: ['./taxonomy-upload-problem-accepted-names-page.scss'],
})

export class TaxonomyUploadProblemAcceptedNamesPage implements OnInit {

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
