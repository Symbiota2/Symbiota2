import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonService
} from '../../../services';
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector: 'taxonomy-upload-problem-parent-names',
    templateUrl: './taxonomy-upload-problem-parent-names-page.html',
    styleUrls: ['./taxonomy-upload-problem-parent-names-page.scss'],
})

export class TaxonomyUploadProblemParentNamesPage implements OnInit {

    names = []

    constructor(
        private readonly taxaService: TaxonService,
    ) {

    }

    /*
    Called when Angular starts
     */
    ngOnInit() {
        this.taxaService.getProblemParentNames().subscribe((names) => {
            this.names = names
        })

    }

}
