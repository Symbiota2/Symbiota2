import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonService
} from '@symbiota2/ui-plugin-taxonomy';
import { TaxonIDAndNameItem } from '../../../../../ui-plugin-taxonomy/src/lib/dto/taxon-id-and-name-item';

@Component({
    selector: 'image-library',
    templateUrl: './image-library-page.html',
    styleUrls: ['./image-library-page.component.scss'],
})

export class ImageLibraryPageComponent implements OnInit {
    names: TaxonIDAndNameItem[]
    taxonID: string
    level: string = 'family'
    prefix: string = null

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
            const maybeLevel = params.get('level')
            if (maybeLevel) {
                if (maybeLevel == 'genus' || maybeLevel == 'family') {
                    this.level = maybeLevel
                } else if (maybeLevel == ':level') {
                    this.level = 'family'
                } else {
                    if (isNaN(Number(maybeLevel))) {
                        this.prefix = maybeLevel
                        //this.level = 'family'
                        this.level = 'species'
                    } else {
                        // Load the descendents of the passed taxonID
                        this.level = 'family'
                        //this.level = 'species'
                    }

                }
                console.log("level change " + maybeLevel)
            }
        })
        // Load the names, comes preloaded with families
        this.loadNames(this.level, this.prefix)
    }

    /*
    Load the names at this level
     */
    loadNames(level: string, prefix: string) {
        const partialName = prefix ? prefix : ''
        this.taxonService.findScientificNames(partialName,level).subscribe((myNames) => {
            this.names = myNames.sort((a,b) =>
                a.name > b.name ? 1 : -1)
        })
    }

    goToLink(url: string){
        window.open("taxon/editor/" + url, "_blank");
    }
}
