import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonomicAuthorityService,
    TaxonomicEnumTreeService, TaxonomicStatusService,
    TaxonService, TaxonVernacularService
} from '../../../../../ui-plugin-taxonomy/src/lib/services';
import {
    TaxonIDAndNameItem
} from '../../../../../ui-plugin-taxonomy/src/lib/dto/taxon-id-and-name-item';
import { ImageService, ImageTagKeyService } from '../../services';
import { MatListOption } from '@angular/material/list';
import {
    CountryListItem,
    CountryService,
    ProvinceListItem,
    StateProvinceService
} from '@symbiota2/ui-plugin-geography';
import { ImageTagKeyListItem, ImageAndTaxonListItem } from '../../dto';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ApiClientService, TypedFormControl } from '@symbiota2/ui-common';
import { IMAGE_API_BASE, IMAGE_DETAILS_ROUTE } from '../../routes';

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
    collectionIDs = new TypedFormControl<number[]>([])
    initialCollectionListLength = 0

    ALL_IMAGES = "All images"
    ONE_PER_TAXON = "One per taxon"
    ONE_PER_OCCURRENCE = "One per occurrence"
    kindOfLimit = this.ALL_IMAGES

    IMAGE_TYPE_OBSERVATION = "Observation"
    IMAGE_TYPE_FIELD_IMAGE = "field image"
    IMAGE_TYPE_SPECIMEN = "specimen"

    taxonIDList: number[] = []
    taxons: string[] = []

    imageAPIUrl = null
    imageDetailsRoute = IMAGE_DETAILS_ROUTE

    SCIENTIFIC_NAME = "Scientific name"
    COMMON_NAME = "Common name"
    kindOfName = this.SCIENTIFIC_NAME
    nameControl = new FormControl()
    nameOptions: TaxonIDAndNameItem[] = []
    scinames: string[] = []
    @ViewChild('scinameInput') scinameInput: ElementRef<HTMLInputElement>


    commonNameControl = new FormControl()
    commonNames: string[] = []
    commonNameOptions: TaxonIDAndNameItem[] = []
    @ViewChild('commonNameInput') commonNameInput: ElementRef<HTMLInputElement>

    photographerOptions : string[] = []
    allPhotographers : string[] = []
    photographerNames : string[] = []
    photographer = null
    photographerForm = new FormControl()
    photographerNameControl = new FormControl()
    @ViewChild('photographerNameInput') photographerNameInput: ElementRef<HTMLInputElement>

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

    data : ImageAndTaxonListItem[] = []
    data2 : ImageAndTaxonListItem[] = []
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
        private readonly apiClient: ApiClientService,
        private router: Router,
        private formBuilder: FormBuilder,
        private currentRoute: ActivatedRoute
    ) { }

    /*
   Called when Angular starts
   */
    ngOnInit() {
        this.kindOfName = this.SCIENTIFIC_NAME
        this.kindOfLimit = this.ALL_IMAGES

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

        //  Get list of tag keys
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

    selectedPhotographerName(event: MatAutocompleteSelectedEvent): void {
        this.photographerNames.push(event.option.viewValue)
        this.photographerNameInput.nativeElement.value = '';
        this.photographerNameControl.setValue(null)
    }

    removePhotographerName(name: string): void {
        const index = this.photographerNames.indexOf(name)

        if (index >= 0) {
            this.photographerNames.splice(index, 1)
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
    Reload the names as a user types
    */
    onPhotographerNameKey(event) {
        if (event.target.value) {
            this.photographerOptions = this.allPhotographers.filter((name) => {return name.toLowerCase().startsWith(event.target.value.toLowerCase())})
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
                this.allPhotographers = names
                this.allPhotographers.sort(function (a, b) {
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
                })
        } else {
            this.taxonVernacularService.findAllCommonNamesByLanguage(language, partialName, this.taxonomicAuthorityID)
                .subscribe((names) => {
                    this.commonNameOptions = names
                })
        }

    }

    /*
    Called when a taxon is chosen to search for an image
     */
    onClear(): void {
        this.kindOfName = this.SCIENTIFIC_NAME
        this.kindOfLimit = this.ALL_IMAGES
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
        this.imageTypes = this.imageTypeForm.value? this.imageTypeForm.value.filter((v) => {return v != this.ALL_IMAGES}) : []
        this.tagKeys = this.tagKeyForm.value? this.tagKeyForm.value : []
        //this.photographerNames = this.photographerForm.value? this.photographerForm.value : []
        this.countries = this.countryForm.value? this.countryForm.value : []
        this.keywords = this.keywordValue? this.keywordValue.split(',') : []
        this.imageService.imageSearch(
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
            this.kindOfLimit == this.ONE_PER_TAXON,
            this.kindOfLimit == this.ONE_PER_OCCURRENCE,
            this.countries,
            this.stateProvinces,
            []
        ).subscribe((images) => {
            this.data2 = images
            this.data = []
            //this.data = images
            this.getData(null)
        })
        this.submitted = true
    }

    goToLink(url: string){
        window.open("taxon/editor/" + url, "_blank");
    }

    /*
    Used in the pagination
     */
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

    localize(name) {
        const re = new RegExp('^(?:[a-z]+:)?//', 'i')
        if (re.test(name)) {
            // We have an external url
            return name
        } else {
            if (!this.imageAPIUrl) {
                this.imageAPIUrl = this.apiClient.apiRoot() + "/" + IMAGE_API_BASE  + "/imglib/"
            }
            return this.imageAPIUrl + encodeURIComponent(name)
        }

    }

    /*
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
*/
}
