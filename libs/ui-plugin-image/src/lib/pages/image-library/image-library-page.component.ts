import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonomicEnumTreeService,
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
    descendant: number
    level: string = 'family'
    prefix: string = null

    constructor(
        //private readonly userService: UserService,  // TODO: needed?
        private readonly taxonService: TaxonService,
        private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        private router: Router,
        private formBuilder: FormBuilder,
        private currentRoute: ActivatedRoute
    ) { }

    /*
    Called when Angular starts
     */
    ngOnInit() {
        this.descendant = null
        this.prefix = null
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
                        //this.level = 'family'
                        this.level = 'species'
                        this.descendant = Number(maybeLevel)
                    }

                }
                console.log("level change " + maybeLevel)
            }
        })
        // Load the names, comes preloaded with families
        this.loadNames(this.level, this.prefix, this.descendant)
    }

    /*
    Load the names at this level
     */
    loadNames(level: string, prefix: string, descendant: number) {
        const partialName = prefix ? prefix : ''
        if (descendant) {
            const myNames = []
            this.taxonomicEnumTreeService.findDescendantsByRank(descendant,220)
                .subscribe((items) => {
                    items.forEach((item) =>{
                        const pair = new TaxonIDAndNameItem()
                        pair.name = item.taxon.scientificName
                        pair.id = item.taxonID
                        myNames.push(pair)
                    })
                    this.names = myNames.sort((a,b) =>
                        a.name > b.name ? 1 : -1)
            })
        }
        else {
            this.taxonService.findScientificNames(partialName,level).subscribe((myNames) => {
                this.names = myNames.sort((a,b) =>
                    a.name > b.name ? 1 : -1)
            })
        }
    }

    goToLink(url: string){
        window.open("taxon/editor/" + url, "_blank");
    }

    loadDescendants(taxonID: number) {
        this.taxonomicEnumTreeService.findDescendantsByRank(taxonID, 220).subscribe((myEnumTrees) => {
            const myNames = []
            myEnumTrees.forEach((enumTree) => {
                const name = enumTree.taxon.scientificName
                const taxonID = enumTree.taxon.id
                const pair = new TaxonIDAndNameItem()
                pair.name = name
                pair.id = taxonID
                myNames.push(pair)
            })
            this.names = myNames.sort((a,b) =>
                a.name > b.name ? 1 : -1)
        })
    }
}
