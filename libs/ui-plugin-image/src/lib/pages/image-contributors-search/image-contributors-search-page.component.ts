import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonIDAndNameItem,
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
import { ImageListItem } from '../../dto/ImageListItem';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TypedFormControl } from '@symbiota2/ui-common';

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
    selector: 'image-contributors-search',
    templateUrl: './image-contributors-search-page.html',
    styleUrls: ['./image-contributors-search-page.component.scss'],
})

export class ImageContributorsSearchPageComponent implements OnInit {
    collectionIDs = new TypedFormControl<number[]>([])
    initialCollectionListLength = 0

    limitTaxons = false
    limitOccurrences = false

    taxonIDList: number[] = []
    taxons: string[] = []

    kindOfName
    nameControl = new FormControl()
    nameOptions: TaxonIDAndNameItem[] = []
    scinames: string[] = []
    @ViewChild('scinameInput') scinameInput: ElementRef<HTMLInputElement>


    commonNameControl = new FormControl()
    commonNames: string[] = []
    commonNameOptions: TaxonIDAndNameItem[] = []
    @ViewChild('commonNameInput') commonNameInput: ElementRef<HTMLInputElement>

    photographerOptions : string[] = []
    photographerNames : string[] = []
    photographer = null
    photographerForm = new FormControl()


    keywords: string[] = []
    keywordValue

    myDateGroup: FormGroup
    startDate: Date
    endDate: Date

    hasAuthors = false
    includeAuthors = false
    language = "none"
    languageList = []
    taxonomicAuthorityList = []
    taxonomicAuthorityID = 1 // Set the default taxa authority id
    needIdentification = false
    includeLowQuality = false
    atLevelOfSpecies = true

    tagKeys : string[] = []
    tagKeyOptions : ImageTagKeyListItem[] = []
    selectedTagKeyOptions = []
    tagKeyForm = new FormControl()

    imageTypes : string[] = []
    imageTypeOptions : string[] = []
    imageTypeForm = new FormControl()

    countries : string[] = []
    countryOptions : CountryListItem[] = []
    countryForm = new FormControl()

    stateProvinces : string[] = []
    stateProvinceOptions : ProvinceListItem[] = []
    stateProvinceForm = new FormControl()

    nameFound = false
    looking = false
    possibleTaxons  = []

    submitted = false

    data : ImageListItem[] = []
    data2 : ImageListItem[] = []
    page= 0
    size = 20
    pageSizeOptions = [20, 40, 60, 80, 100]

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
   Called when Angular starts
   */
    ngOnInit() {
        this.kindOfName = "1"

        this.initialCollectionListLength = this.collectionIDs.value.length
        this.collectionIDs.registerOnChange(() => {
            if (this.initialCollectionListLength == 0) {
                this.initialCollectionListLength = this.collectionIDs.value.length
            }
        })

        // Load the authorities
        this.loadAuthorities()

        // Get the photographer names for display in the menu
        this.loadPhotographers()

        // Get the image types for display
        this.loadImageTypes()

        // Get list of countries
        this.loadCountries()

        // Get list of states and provinces
        this.loadStates()

        // Get list of tag keys
        this.loadTagKeys()
    }

    selectedSciname(event: MatAutocompleteSelectedEvent): void {
        this.scinames.push(event.option.viewValue)
        this.scinameInput.nativeElement.value = '';
        this.nameControl.setValue(null)
    }

    removeSciname(name: string): void {
        const index = this.scinames.indexOf(name)

        if (index >= 0) {
            this.scinames.splice(index, 1)
        }
    }

    selectedCommonName(event: MatAutocompleteSelectedEvent): void {
        this.commonNames.push(event.option.viewValue)
        this.commonNameInput.nativeElement.value = '';
        this.commonNameControl.setValue(null)
    }

    removeCommonName(name: string): void {
        const index = this.commonNames.indexOf(name)

        if (index >= 0) {
            this.commonNames.splice(index, 1)
        }
    }

    nameFor(option) {
        return this.hasAuthors? option.split(' -')[0] : option
    }

    authorFor(option) {
        return this.hasAuthors? option.split(' -')[1] : ""
    }

    /*
    Taxonomic authority has a new value
     */
    authorityChangeAction() {
        // If the authority changes...
    }

    countryListChange(country) {

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
            this.loadScientificNames(event.target.value)
        }
    }

    /*
    Reload the names as a user types
    */
    onCommonNameKey(event) {
        if (event.target.value) {
            this.loadCommonNames(event.target.value)
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
    Load the states
    */
    public loadStates() {
        this.stateProvinceService.provinceList.subscribe((states) => {
            this.stateProvinceOptions = states
            /*
            states.forEach((state) => {
                console.log("state " + state)
            })
             */
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

    /*
    Load the image types
    */
    public loadImageTypes() {
        this.imageService.findImageTypes()
            .subscribe((types) => {
                this.imageTypeOptions = types
                this.imageTypeOptions.sort(function (a, b) {
                    return (a > b ? 1 : -1)
                })
            })
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
    Load Scientific names that start with partialName into a list
     */
    public loadScientificNames(partialName) {
        this.nameOptions= []
        if (this.hasAuthors) {
            //this.taxaService.findAllScientificNamesPlusAuthors(partialName, this.taxonomicAuthorityID)
            //    .subscribe((names) => {
            //        this.nameOptions = names
            //    })
        } else {
            this.taxaService.findAllScientificNamesWithImages(partialName, this.taxonomicAuthorityID)
                .subscribe((names) => {
                    this.nameOptions = names
                })
        }
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
                    this.commonNameOptions = names
                    console.log(" names " + names.length)
                })
        } else {
            this.taxonVernacularService.findAllCommonNamesByLanguage(language, partialName, this.taxonomicAuthorityID)
                .subscribe((names) => {
                    this.commonNameOptions = names
                    console.log(" languages " + names.length)
                })
        }

    }

    /*
    Called when a taxon is chosen to search for an image
     */
    onClear(): void {
        this.kindOfName = "1"
        this.taxons = []
        this.taxonIDList = []
        this.imageTypes = []
        this.tagKeys = []
        this.photographerNames = []
        this.countries = []
        this.stateProvinces = []

        this.countryForm.reset()
        this.stateProvinceForm.reset()
        this.imageTypeForm.reset()
        this.photographerForm.reset()
        this.tagKeyForm.reset()
        this.nameControl.reset()
        this.commonNameControl.reset()
        this.startDate = null
        this.endDate = null
        new TypedFormControl<number[]>([])
        this.limitTaxons = false
        this.limitOccurrences = false

        this.keywordValue = ''
        this.submitted = false
    }
    /*
    Called when a taxon is chosen to search for an image
    */
    onSubmit(): void {
        if (this.nameControl.value) {
            // const names : number[] = this.nameControl.value
            //names.forEach((value) => {
            //    this.taxonIDList.push(value)
            //})
            this.nameOptions.forEach((name) => {
                if (this.nameControl.value == name.name) {
                    this.taxonIDList.push(name.id)
                    this.taxons.push(name.name)
                }
            })
        }

        this.stateProvinces = this.stateProvinceForm.value? this.stateProvinceForm.value : []
        this.imageTypes = this.imageTypeForm.value? this.imageTypeForm.value : []
        this.tagKeys = this.tagKeyForm.value? this.tagKeyForm.value : []
        this.photographerNames = this.photographerForm.value? this.photographerForm.value : []
        this.countries = this.countryForm.value? this.countryForm.value : []
        this.keywords = this.keywordValue? this.keywordValue.split(',') : []
        this.imageService.imageContributorsSearch(
            // If the collections haven't changed don't pass them
            this.collectionIDs.value.length == this.initialCollectionListLength ? [] : this.collectionIDs.value,
            this.scinames,
            this.commonNames,
            this.keywords,
            this.photographerNames,
            this.imageTypes,
            this.startDate,
            this.endDate,
            this.tagKeys,
            this.limitTaxons,
            this.limitOccurrences
        ).subscribe((images) => {
            /*
            console.log("got images " + images.length)
            images.forEach((image) => {
                console.log("url " + image.url)
                console.log("thumbnail " + image.thumbnailUrl)
                console.log("id " + image.id)
            })
             */
            this.data2 = images
            this.data = []
            //this.data = images
            this.getData(null)
        })
        this.submitted = true
        // const sname = this.hasAuthors? this.nameControl.value.split(' -')[0] : this.nameControl.value
    }

    goToLink(url: string){
        window.open("taxon/editor/" + url, "_blank");
    }

    getData(obj) {
        let index=0
        let startingIndex = 0
        let endingIndex = this.size
        if (obj) {
            startingIndex= obj.pageIndex * obj.pageSize
            endingIndex= startingIndex + obj.pageSize
        }

        this.data = this.data2.filter(() => {
            index++;
            return (index > startingIndex && index <= endingIndex) ? true : false
        })
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
