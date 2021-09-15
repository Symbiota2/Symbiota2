import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
TaxonService
} from '@symbiota2/ui-plugin-taxonomy';

@Component({
    selector: 'image-search',
    templateUrl: './image-search-page.html',
    styleUrls: ['./image-search-page.component.scss'],
})

export class ImageSearchPageComponent implements OnInit {
    taxonID: string

    constructor(
        //private readonly userService: UserService,  // TODO: needed?
        private readonly taxonService: TaxonService,
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
        })
    }

    goToLink(url: string){
        window.open("taxon/editor/" + url, "_blank");
    }
}
