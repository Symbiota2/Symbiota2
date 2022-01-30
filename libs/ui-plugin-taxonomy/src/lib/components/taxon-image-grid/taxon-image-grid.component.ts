import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonDescriptionBlockListItem, TaxonDescriptionBlockService, TaxonIDAndNameItem, TaxonInputDto,
    TaxonomicAuthorityService, TaxonomicEnumTreeService,
    TaxonomicStatusService, TaxonomicUnitService,
    TaxonService, TaxonVernacularService
} from '@symbiota2/ui-plugin-taxonomy';
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog';
import { AlertService, ApiClientService, AppConfigService, TypedFormControl, UserService } from '@symbiota2/ui-common';
import { TaxonomicStatusInputDto } from '../../dto/taxonomicStatusInputDto';
import { TaxonIDAuthorNameItem } from '../../dto/taxon-id-author-name-item';
import { plainToClass } from 'class-transformer';
import { filter, switchMap, take } from 'rxjs/operators';
import { ImageListItem, ImageService, ImageTagKeyListItem, ImageTagKeyService } from '@symbiota2/ui-plugin-image';
import { ImageInputDto } from '../../../../../ui-plugin-image/src/lib/dto/ImageInputDto';
import { combineLatest } from 'rxjs';
import { TAXA_UPLOADER_FIELD_MAP_ROUTE } from '../../routes';
import { TaxonomyUploadService } from '../../services/taxonomyUpload/taxonomy-upload.service';
import {
    CountryListItem,
    CountryService,
    ProvinceListItem,
    StateProvinceService
} from '@symbiota2/ui-plugin-geography';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ImageAndTaxonListItem } from '../../../../../ui-plugin-image/src/lib/dto/ImageAndTaxonListItem';
import { IMAGE_API_BASE, IMAGE_DETAILS_ROUTE } from '../../../../../ui-plugin-image/src/lib/routes';

@Component({
    selector: 'taxon-image-grid',
    templateUrl: './taxon-image-grid.component.html',
    styleUrls: ['./taxon-image-grid.component.scss'],
})

export class TaxonImageGridComponent implements OnInit {
    // User stuff
    userID : number = null
    userCanEdit: boolean = false

    // Which taxon am I editing?
    taxonID: string
    // Bound information about the taxon
    taxon
    // The scientific name of the taxon, initially "unknown"
    taxonName = "unknown"
    ALL_IMAGES = "All images"
    ONE_PER_TAXON = "One per taxon"
    ONE_PER_OCCURRENCE = "One per occurrence"
    kindOfLimit = this.ALL_IMAGES

    imageAPIUrl = null
    imageDetailsRoute = IMAGE_DETAILS_ROUTE
    IMAGE_TYPE_OBSERVATION = "Observation"
    IMAGE_TYPE_FIELD_IMAGE = "field image"
    IMAGE_TYPE_SPECIMEN = "specimen"

    taxonIDList: number[] = []
    taxons: string[] = []

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

    looking = false

    submitted = false

    data : ImageAndTaxonListItem[] = []
    data2 : ImageAndTaxonListItem[] = []
    page= 0
    size = 20
    pageSizeOptions = [20, 40, 60, 80, 100]

    constructor(
        private readonly taxaService: TaxonService,
        private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        private readonly taxonomicStatusService: TaxonomicStatusService,
        private readonly taxonVernacularService: TaxonVernacularService,
        private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
        private readonly imageService: ImageService,
        private router: Router,
        private formBuilder: FormBuilder,
        private currentRoute: ActivatedRoute,
        private readonly apiClient: ApiClientService,
    ) { }

    /*
   Called when Angular starts
   */
    ngOnInit() {
        this.currentRoute.paramMap.subscribe(params => {
            this.taxonID = params.get('taxonID')
            this.loadImages()
        })


    }

    /*
    Called when a taxon is chosen to search for an image
    */
    loadImages(): void {

        this.imageService.imageSearch(
            // If the collections haven't changed don't pass them
            [],
            [],
            [],
            [],
            [],
            [],
            null,
            null,
            [],
            false,
            false,
            [],
            [],
            [+this.taxonID]
        ).subscribe((images) => {
            this.data2 = images
            this.data = []
            //this.data = images
            this.getData(null)
        })
        this.submitted = true
    }

    /*
    goToLink(url: string){
        window.open("taxon/editor/" + url, "_blank");
    }
     */

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
                this.imageAPIUrl = this.apiClient.apiRoot() + "/" + IMAGE_API_BASE + "/"
            }
            return this.imageAPIUrl + name
        }

    }

}
