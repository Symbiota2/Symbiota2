import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonDescriptionBlockListItem, TaxonDescriptionBlockService, TaxonInputDto,
    TaxonomicAuthorityService, TaxonomicEnumTreeService,
    TaxonomicStatusService, TaxonomicUnitService,
    TaxonService, TaxonVernacularService
} from '@symbiota2/ui-plugin-taxonomy';
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { TaxonomicStatusInputDto } from '../../dto/taxonomicStatusInputDto';
import { TaxonIDAuthorNameItem } from '../../dto/taxon-id-author-name-item';
import { plainToClass } from 'class-transformer';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'taxon-create',
    templateUrl: './taxon-create-page.html',
    styleUrls: ['./taxon-create-page.component.scss'],
})

export class TaxonCreatePageComponent implements OnInit {
    // User stuff
    userID : number = null
    userCanEdit: boolean = false

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
    isPublic = true

    // If it is accepted
    isAccepted = true

    // Form control for sort sequence field
    sortSequence : FormControl

    // Form control for required fields
    scientificNameControl : FormControl
    kingdomNameControl : FormControl
    rankControl : FormControl

    unit1ind = false
    unit2ind = false
    unit3ind = false

    kingdomNames = []

    taxonomicAuthorityList = []
    taxonomicAuthorityID = 1 // Default taxa authority is set in nginit

    // Only support scientific names
    kindOfName = 'Scientific'

    // Name of parent taxon
    nameControl
    nameOptions: TaxonIDAuthorNameItem[] = []

    // Name of accepted taxons
    acceptedNameControl
    acceptedNameOptions: TaxonIDAuthorNameItem[] = []
    hasAuthors = true

    constructor(
        private readonly userService: UserService,
        private readonly taxaService: TaxonService,
        private readonly taxonomicUnitService: TaxonomicUnitService,
        private readonly taxonomicStatusService: TaxonomicStatusService,
        private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        // private readonly taxonVernacularService: TaxonVernacularService,
        private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
        // private readonly taxonDescriptionBlockService: TaxonDescriptionBlockService,
        private readonly alertService: AlertService,
        private router: Router,
        private formBuilder: FormBuilder,
        private currentRoute: ActivatedRoute,
        private readonly translate: TranslateService,
        public dialog: MatDialog
    ) {

    }

    /*
    Called when Angular starts
     */
    ngOnInit() {
        // Initialize form validators
        this.local_data = { }
        this.action = this.local_data.action
        this.sortSequence =
            new FormControl(
                this.local_data.phyloSortSequence,
                [Validators.pattern("[0-9]+")]
            )

        this.scientificNameControl =
            new FormControl(
                this.local_data.scientificName,
                [Validators.required]
            )

        this.kingdomNameControl =
            new FormControl(
                this.local_data.kingdomName,
                [Validators.required]
            )

        this.rankControl =
            new FormControl(
                this.local_data.rankID,
                [Validators.required]
            )

        this.nameControl =
            new FormControl(
                undefined,
                [Validators.required]
            )

        this.acceptedNameControl =
            new FormControl(
                undefined,
                [Validators.required]
            )

        // Load the authorities
        this.loadAuthorities()

        this.rankNamesMap = new Map()
        this.taxonomicUnitService.findAll().subscribe((ranks) => {
            ranks.forEach((rank) => {
                this.rankNamesMap.set(rank.rankID, {name: rank.rankName, id: rank.rankID})
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
        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditTaxon(user.uid)
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
    public hasError = (controlName: string, errorName: string) =>{
        return this.formControl.controls[controlName].hasError(errorName);
    }

     */

    getName(s) {
        return s ? s.name + " " + s.author : ""
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
        this.acceptedNameOptions= []
        if (this.hasAuthors) {
            this.taxaService.findAllScientificNamesPlusAuthors(partialName, this.taxonomicAuthorityID)
                .subscribe((names) => {
                    this.acceptedNameOptions = names
                })
        } else {
            this.taxaService.findAllScientificNames(partialName, this.taxonomicAuthorityID)
                .subscribe((names) => {
                    this.acceptedNameOptions = names
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
            this.isPublic = true
        } else {
            this.local_data.securityStatus = "x"
            this.isPublic = false
        }
    }

    // Change the acceptance
    onAcceptedChange() {
        this.isAccepted = !this.isAccepted
    }

    moveTaxonToNewParent(taxonID, newParent: string, authorityID) {
        // Figure out taxon id for the new parent
        // Look up the scientific name first
        this.taxaService.findScientificName(newParent.trim(),authorityID)
            .subscribe((taxon) => {
                let parentTaxonID = taxon.id
                // Move in taxa enum tree
                this.taxonomicEnumTreeService.move(+taxonID, parentTaxonID, authorityID).subscribe((enumTree) => {
                    if (!enumTree) {
                        // [TODO fix since Error occurred]
                        this.showError("taxon.status.editor.updated.move.error")
                    }
                    // Update the parent to the new parent
                    this.taxonomicStatusService.findByID(+taxonID, +authorityID, taxonID).subscribe((status) => {
                        let a = status as unknown as Record<PropertyKey, unknown>
                        const data = new TaxonomicStatusInputDto(a)
                        data.parentTaxonID = parentTaxonID
                        this.taxonomicStatusService
                            .update(data)
                            .subscribe((taxStatus)=> {
                                if (taxStatus) {
                                    // It has been updated in the database
                                    this.showMessage("taxon.status.editor.move.updated")
                                } else {
                                    // Error in adding
                                    this.showError("taxon.status.editor.updated.move.error")
                                }
                                // Reload the taxon
                                // this.loadTaxonStatus(+this.taxonID)
                            })
                    })
                })
            })
    }

    doSave(){
        this.local_data.phyloSortSequence = this.sortSequence.value
        this.local_data.rankID = this.rankControl.value
        this.local_data.scientificName = this.scientificNameControl.value
        this.local_data.parentTaxonID = this.nameControl.value?.id
        this.local_data.taxonIDAccepted = this.acceptedNameControl.value?.id
        this.local_data.kingdomName = this.kingdomNameControl.value
        this.local_data.taxonAuthorityID = this.taxonomicAuthorityID
        this.local_data.unitInd1 = this.unit1ind ? "x" : null
        this.local_data.unitInd2 = this.unit2ind ? "x" : null
        this.local_data.unitInd3 = this.unit3ind ? "x" : null
        this.local_data.initialTimestamp = new Date()
        this.local_data.lastModifiedTimestamp = this.local_data.initialTimestamp
        this.local_data.lastModifiedUID = this.userID

        // Construct a new taxon
        //let a = this.local_data as unknown as Record<PropertyKey, unknown>
        // a.initialTimestamp = new Date()
        const newTaxon =  plainToClass(TaxonInputDto, this.local_data)

        this.taxaService.create(newTaxon).subscribe((taxon)=> {
            if (taxon) {
                // It has been saved in the database, create the status record
                const data = {
                    "taxonID" : taxon.id,
                    "parentTaxonID" : this.nameControl.value?.id,
                    "taxonIDAccepted" : this.isAccepted ? taxon.id : this.acceptedNameControl.value?.id,
                    "initialTimestamp" : new Date(),
                    "taxonAuthorityID" : this.taxonomicAuthorityID
                }
                const newStatus =  plainToClass(TaxonomicStatusInputDto, data)

                // Now save the taxonomic status
                this.taxonomicStatusService.create(newStatus).subscribe((status) => {
                    if (status) {
                        this.taxonomicEnumTreeService.move(taxon.id, this.nameControl.value?.id, this.taxonomicAuthorityID).subscribe((enumTree) => {
                            if (!enumTree) {
                                // [TODO fix since Error occurred]
                                this.showError("taxon.status.editor.updated.move.error")
                            } else {
                                this.showMessage("taxon.create.saved")
                            }
                        })
                    } else {
                        // Error in adding
                        this.showError("taxon.editor.updated.error")
                    }
                })
            } else {
                // Error in adding
                this.showError("taxon.editor.updated.error")
            }
        })
    }

    doClear() {
        //this.dialogRef.close({event:'Cancel'})
    }

    /*
    Taxonomic authority has a new value
    */
    authorityChangeAction() {
        // If the authority changes...
    }

    /*
    Internal routine to encapsulate the show error message at the bottom in case something goes awry
    */
    private showError(s) {
        this.translate.get(s).subscribe((r)  => {
            this.alertService.showError(r)
        })
    }

    /*
    Internal routine to encapsulate the show message at the bottom to confirm things actually happened
    */
    private showMessage(s) {
        this.translate.get(s).subscribe((r)  => {
            this.alertService.showMessage(r)
        })
    }

}
