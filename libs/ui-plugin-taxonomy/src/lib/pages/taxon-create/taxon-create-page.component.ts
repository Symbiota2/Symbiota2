import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonDescriptionBlockListItem, TaxonDescriptionBlockService,
    TaxonomicAuthorityService,
    TaxonomicStatusService, TaxonomicUnitService,
    TaxonService, TaxonVernacularService
} from '@symbiota2/ui-plugin-taxonomy';
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '@symbiota2/ui-common';

@Component({
    selector: 'taxon-create',
    templateUrl: './taxon-create-page.html',
    styleUrls: ['./taxon-create-page.component.scss'],
})

export class TaxonCreatePageComponent implements OnInit {
    // Which taxon am I editing?
    taxonID: string
    // Bound information about the taxon
    taxon
    // The scientific name of the taxon, initially "unknown"
    taxonName = "unknown"
    // The description of the taxon
    blocks: TaxonDescriptionBlockListItem[] =[]

    public action : string
    public local_data : any
    public rankNamesMap = new Map()
    public rankNames = []
    public rankID
    public element
    sortSequence
    unit1ind = false
    unit2ind = false
    unit3ind = false

    kingdomNames = []

    taxonomicAuthorityList = []
    taxonomicAuthorityID = 1 // Default taxa authority is set in nginit

    kindOfName = 'Scientific'
    nameControl = new FormControl()
    nameOptions: string[] = []
    hasAuthors = true

    constructor(
        private readonly userService: UserService,
        private readonly taxaService: TaxonService,
        private readonly taxonomicUnitService: TaxonomicUnitService,
        private readonly taxonomicStatusService: TaxonomicStatusService,
        private readonly taxonVernacularService: TaxonVernacularService,
        private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
        private readonly taxonDescriptionBlockService: TaxonDescriptionBlockService,
        private router: Router,
        private formBuilder: FormBuilder,
        private currentRoute: ActivatedRoute,
        private readonly translate: TranslateService,
        public dialog: MatDialog
    ) {
        this.local_data = { }
        this.action = this.local_data.action
        this.sortSequence =
            new FormControl(
                this.local_data.phyloSortSequence,
                [Validators.pattern("[0-9]+")]
            )
    }

    /*
    Called when Angular starts
     */
    ngOnInit() {
        // Load the authorities
        this.loadAuthorities()

        this.rankNamesMap = new Map()
        this.taxonomicUnitService.findAll().subscribe((ranks) => {
            ranks.forEach((rank) => {
                this.rankNamesMap.set(rank.rankID, {name: rank.rankName, id: rank.rankID})
                /*
                if (rank.kingdomName == this.local_data.kingdomName) {
                    console.log("setting")
                    this.rankNamesMap.set(rank.rankID, {name: rank.rankName, id: rank.rankID})
                }
                if (rank.rankID = this.local_data.rankID) {
                    console.log("xxx")
                    this.rankID = rank.rankID
                }
                 */
            })
            const keys =[ ...this.rankNamesMap.keys() ].sort((a,b) => a-b)
            keys.forEach((key) => {
                this.rankNames.push(this.rankNamesMap.get(key))
            })
            // Trigger binding
            const temp = this.rankNames
            this.rankNames = []
            this.rankNames = temp
        })
        this.taxonomicUnitService.findKingdomNames().subscribe((names) => {
            this.kingdomNames = names
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

    nameFor(option) {
        return this.hasAuthors? option.split(' -')[0] : option
    }

    authorFor(option) {
        return this.hasAuthors? option.split(' -')[1] : ""
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
    Reload the names as a user types
    */
    onKey(event) {
        if (event.target.value) {
            const partialName = event.target.value
            this.loadNames(partialName)
        }
    }

    /*
    Reload the names as needed
     */
    loadNames(partialName) {
        if (this.kindOfName == 'Scientific') {
            this.loadScientificNames(partialName)
        } else {
            // An error, no common names suppported, should never get here
        }
    }

    // Change the security status
    onSecurityStatusChange() {
        if (this.local_data.securityStatus == "x" || this.local_data.securityStatus == "X") {
            this.local_data.securityStatus = "0"
        } else {
            this.local_data.securityStatus = "x"
        }
    }

    doSave(){
        this.local_data.phyloSortSequence = this.sortSequence
        this.local_data.rankID = this.rankID
        // this.dialogRef.close({event:this.action,data:this.local_data})
    }

    doClear(){
        //this.dialogRef.close({event:'Cancel'})
    }

    /*
    Load the taxon profile
    */
    loadProfile(taxonID: number) {
        this.taxaService.findByID(taxonID).subscribe((taxon) => {
            this.taxon = taxon
            this.taxonName = taxon.scientificName
        })
        this.taxonDescriptionBlockService.findBlocksByTaxonID(taxonID).subscribe((blocks) => {
            blocks.forEach((block) => {
                if (block.descriptionStatements.length > 0) {
                    block.descriptionStatements = block.descriptionStatements.sort((a, b) => a.sortSequence - b.sortSequence)
                }
            })
            this.blocks = blocks
        })
    }

    /*
    Taxonomic authority has a new value
    */
    authorityChangeAction() {
        // If the authority changes...
    }
}
