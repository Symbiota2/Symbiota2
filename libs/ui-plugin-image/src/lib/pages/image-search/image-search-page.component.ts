import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonomicAuthorityService,
    TaxonomicEnumTreeService, TaxonomicStatusService,
    TaxonService, TaxonVernacularService
} from '@symbiota2/ui-plugin-taxonomy';
import { ImageService, ImageTagKeyService } from '../../services';
import { MatListOption } from '@angular/material/list';
import {
    CountryListItem,
    CountryService,
    ProvinceListItem,
    StateProvinceService
} from '@symbiota2/ui-plugin-geography';
import { ImageTagKeyListItem } from '../../dto';

/**
 * Taxonomic data with nested structure.
 * Each node has a name and an optional list of children.
 * The expanded flag is set if the node is expanded (already has children listed)
 * The synonym flag is set if this is a synonym
 */
interface TaxonNode {
    name: string
    taxonID: number
    author: string
    expanded?: boolean
    synonym?: boolean
    children?: TaxonNode[]
}

@Component({
    selector: 'image-search',
    templateUrl: './image-search-page.html',
    styleUrls: ['./image-search-page.component.scss'],
})

export class ImageSearchPageComponent implements OnInit {
    nameControl = new FormControl()
    nameOptions: string[] = []

    photographerNameControl = new FormControl()
    photographerOptions = []
    photographer = null
    photographerForm

    hasAuthors = false
    includeAuthors = false
    language = "none"
    kindOfName = "Scientific"
    languageList = []
    taxonomicAuthorityList = []
    taxonomicAuthorityID = 1 // Set the default taxa authority id
    needIdentification = false
    includeLowQuality = false
    atLevelOfSpecies = true

    tagKey : ImageTagKeyListItem = null
    tagKeyOptions : ImageTagKeyListItem[] = []
    selectedTagKeyOptions = []
    tagKeyForm

    country : CountryListItem[] = []
    countryOptions : CountryListItem[] = []
    countryForm

    stateProvince : ProvinceListItem[] = []
    stateProvinceOptions : ProvinceListItem[] = []
    stateProvinceForm

    nameFound = false
    looking = false
    possibleTaxons  = []

    data = []
    data2 = []
    page= 0
    size = 4

    constructor(
        //private readonly userService: UserService,  // TODO: needed?
        private readonly taxaService: TaxonService,
        private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        private readonly taxonomicStatusService: TaxonomicStatusService,
        private readonly taxonVernacularService: TaxonVernacularService,
        private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
        private readonly imageService: ImageService,
        private readonly imageTagKeyService: ImageTagKeyService,
        private readonly countryService: CountryService,
        private readonly stateProvinceService: StateProvinceService,
        private router: Router,
        private formBuilder: FormBuilder,
        private currentRoute: ActivatedRoute
    ) { }

    /*
    value - array of cities
    input - user input in search box
    when there is an input, filter & return all matches
    when there is no input, display all data
    filter() is a javascript method that returns a new array of all values
    that pass a test defined in the method.
     */
    transform (value: any, input: any): any {
        if (input) {
            return value.filter((val) => {
                val.indexOf(input)  >= 0
            })
        } else {
            return value
        }
    }

    /*
   Called when Angular starts
   */
    ngOnInit() {
        // Load the authorities
        this.loadAuthorities()

        // Get the common languages for display in the menu
        this.loadVernacularLanguages()

        // Get the photographer names for display in the menu
        this.loadPhotographers()

        // Get list of countries
        this.loadCountries()

        // Get list of states and provinces
        this.loadStates()

        // Get list of tag keys
        this.loadTagKeys()
    }

    nameFor(option) {
        return this.hasAuthors? option.split(' -')[0] : option
    }

    authorFor(option) {
        return this.hasAuthors? option.split(' -')[1] : ""
    }
    /*
    The vernacular language menu has a new choice
     */
    languageChangeAction(language) {
        this.language = language
    }

    /*
    Taxonomic authority has a new value
     */
    authorityChangeAction() {
        // If the authority changes...
    }

    /*
    Reload the names as needed
     */
    loadNames(partialName) {
        if (this.kindOfName == 'Scientific') {
            this.loadScientificNames(partialName)
        } else {
            this.loadCommonNames(partialName)
        }
    }

    countryListChange(country) {

    }

    tagKeyListChange(tagKey : MatListOption[]) {
        tagKey.forEach((tagKey) => {
            console.log(" tag key selected " + tagKey.value)
        })

    }
    /*
    Called when the choice of scientific vs. common is changed
     */
    configureChangeAction() {
        this.nameOptions = []
        this.nameControl.setValue("")
    }

    /*
    Reload the names as a user types
     */
    onKey(event) {
        if (event.target.value) {
            const partialName = event.target.value
            this.loadNames(partialName)
        }
    }

    /*
    Reload the names as a user types
    */
    onKeyPhotographerName(event) {
        console.log(event.target.value)
        if (event.target.value) {
            //const partialName = event.target.value
            //this.loadNames(partialName)
        }
    }

    /*
    Load the countries
    */
    public loadCountries() {
        this.countryService.countryList.subscribe((names) => {
            this.countryOptions = names
            })
    }

    /*
    Load the countries
    */
    public loadStates() {
        this.stateProvinceService.provinceList.subscribe((states) => {
            this.stateProvinceOptions = states
        })
    }

    /*
    Load the photographer names
    */
    public loadTagKeys() {
        this.imageTagKeyService.findAll()
            .subscribe((tagKeys) => {
                this.tagKeyOptions = tagKeys
                this.tagKeyOptions.sort(function (a, b) {
                    return (a.sortOrder > b.sortOrder ? 1 : -1)
                })
            })
    }

    /*
    Load the photographer names
    */
    public loadPhotographers() {
        this.imageService.findPhotographerNames()
            .subscribe((names) => {
                this.photographerOptions = names
                this.photographerOptions.sort(function (a, b) {
                    return (a > b ? 1 : -1)
                })
            })
    }

    public photographerListChange(photographer) {
        this.photographer = photographer
    }

    /*
    Load the taxa authorities
    */
    public loadAuthorities() {
        this.taxonomicAuthorityService.findAll()
            .subscribe((authorities) => {
                this.taxonomicAuthorityList = authorities
                this.taxonomicAuthorityList.sort(function (a, b) {
                    return (a.id > b.id ? 1 : -1)
                })
                this.taxonomicAuthorityList.forEach((authority) => {
                    if (authority.isPrimay) {
                        this.taxonomicAuthorityID = authority.id
                    }
                })
            })
    }

    /*
    Load the kingdoms -- currently not implemented or used
     */
    public loadKingdoms() {

    }

    /*
    Load the languages for vernacular names
     */
    public loadVernacularLanguages() {
        this.taxonVernacularService.findAllLanguages(this.taxonomicAuthorityID)
            .subscribe((language) => {
                this.languageList = language
            })
    }

    /*
    Load the common names using the chosen language
     */
    public loadCommonNames(partialName) {
        const language = this.language

        // If the language is not set, load all of the common names
        if (this.language == "none") {
            this.taxonVernacularService.findAllCommonNames(partialName, this.taxonomicAuthorityID)
                .subscribe((names) => {
                    this.nameOptions = names
                })
        } else {
            this.taxonVernacularService.findAllCommonNamesByLanguage(language, partialName, this.taxonomicAuthorityID)
                .subscribe((names) => {
                    this.nameOptions = names
                })
        }

    }

    /*
    Load Scientific names that start with partialName into a list
     */
    public loadScientificNames(partialName) {
        this.nameOptions= []
        if (this.hasAuthors) {
            this.taxaService.findAllScientificNamesPlusAuthors(partialName, this.taxonomicAuthorityID)
                .subscribe((names) => {
                    this.nameOptions = names
                })
        } else {
            this.taxaService.findAllScientificNames(partialName, this.taxonomicAuthorityID)
                .subscribe((names) => {
                    this.nameOptions = names
                })
        }
    }
    /*
    Called when a taxon is chosen to search for an image
    */
    onSubmit(): void {
        if (this.kindOfName == 'Scientific') {
            const sname = this.hasAuthors? this.nameControl.value.split(' -')[0] : this.nameControl.value

        } else {
            this.nameControl.value
        }

    }

    goToLink(url: string){
        window.open("taxon/editor/" + url, "_blank");
    }

    getData(obj) {
        let index=0,
            startingIndex=obj.pageIndex * obj.pageSize,
            endingIndex=startingIndex + obj.pageSize;

        this.data = this.data2.filter(() => {
            index++;
            return (index > startingIndex && index <= endingIndex) ? true : false;
        });
    }

    nameListChange(options: MatListOption[]) {
        //this.buildTree(+options.map(o => o.value))
    }

    nameListCheck(sciname) {
        this.looking = true
        // Look up the scientific name first
        this.taxaService.findByScientificName(sciname.trim(), this.taxonomicAuthorityID)
            .subscribe((taxons) => {
                if (!taxons) {
                    // No name found
                    this.nameFound = false
                } else if (taxons.length > 1) {
                    // Found several names
                    this.nameFound = true
                    // Need to build a list of taxons to select
                    // lookup its name by tid
                    this.possibleTaxons = []
                    taxons.forEach((item) => {
                        this.taxaService.findByID(item.id, this.taxonomicAuthorityID)
                            .subscribe((taxon) => {
                                // Found a synonym, add it to the list of synonyms
                                const taxonItem: TaxonNode = {
                                    name: taxon.scientificName,
                                    taxonID: item.id,
                                    author: taxon.author,
                                    expanded: false,
                                    synonym: false,
                                    children: []
                                }
                                this.possibleTaxons.push(taxonItem)
                            })
                    })
                } else {
                    // Found one
                    const taxon = taxons[0]
                    if (taxon) {
                        this.nameFound = true
                        //this.buildTree(+taxon.id)
                    } else {
                        // Should never get here
                        this.nameFound = false
                    }
                }
            })
    }

}
