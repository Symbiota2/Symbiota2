import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonListItem, TaxonomicAuthorityService, TaxonomicEnumTreeService, TaxonomicStatusService, TaxonomicUnitService,
    TaxonService, TaxonStatusAcceptedEditorDialogComponent,
    TaxonTaxonDialogComponent
} from '@symbiota2/ui-plugin-taxonomy';
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { filter } from 'rxjs/operators';
import { TaxonInputDto } from '../../dto/taxonInputDto';
import { TaxonStatusParentEditorDialogComponent } from '../taxon-status-parent-editor-dialog/taxon-status-parent-editor-dialog.component';
import { TaxonomicStatusInputDto } from '../../dto/taxonomicStatusInputDto';

export interface TaxStatusInfo {
    kingdomName: string
    rankID: number | null
    scientificName: string
    unitName1: string
    unitName2: string
    unitName3: string
    author: string
    phyloSortSequence: number | null
    status: string
    source: string
    notes: string
    hybrid: string
    securityStatus: number
}

@Component({
    selector: 'taxon-status-editor',
    templateUrl: './taxon-status-editor.html',
    styleUrls: ['./taxon-status-editor.component.scss'],
})

export class TaxonStatusEditorComponent implements OnInit {
    isAccepted = new Map<number,boolean>()
    acceptedName = new Map<number,string>()
    acceptedID = new Map<number,number>()
    parentName = new Map<number,string>()
    parentID = new Map<number,number>()
    synonyms = new Map<number,string[]>()

    // Binding cannot happen with Maps, so have to set up a current state
    currentAuthorityID = 1  // [TODO set up a default value somewhere]
    currentParentName = "unknown parent"
    currentParentID = null
    currentIsAccepted = false
    currentAcceptedID = null
    currentSynonyms = []
    currentAcceptedName = "unknown name"

    taxonomicAuthorityList = []
    allTaxonomicAuthorityList = []

    //taxon: TaxonListItem
    //dataSource
    private taxonID: string
    private idCounter = 0
    userID : number = null
    userCanEdit: boolean = false
    ranksIDtoName = new Map()
    rankName = ""
    statuses = []
    synonymList = []

    constructor(
        private readonly userService: UserService,
        //private readonly taxonBlockService: TaxonDescriptionBlockService,
        private readonly taxaService: TaxonService,
        private readonly taxonomicUnitService: TaxonomicUnitService,
        private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        private readonly taxonomicStatusService: TaxonomicStatusService,
        //private readonly taxonVernacularService: TaxonVernacularService,
        private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
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

        // Set up default case
        this.isAccepted.set(this.currentAuthorityID, false)
        this.acceptedName.set(this.currentAuthorityID, 'unknown')
        this.acceptedID.set(this.currentAuthorityID, null)
        this.synonyms.set(this.currentAuthorityID, [])
        this.parentName.set(this.currentAuthorityID, 'unknown')
        this.parentID.set(this.currentAuthorityID, null)

        this.loadAuthorities()

        this.currentRoute.paramMap.subscribe(params => {
            this.taxonID = params.get('taxonID')
            // Load the taxon
            this.loadTaxonStatus(+this.taxonID)
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
                this.allTaxonomicAuthorityList = authorities
            })

    }

    /*
    Taxonomic authority has a new value
    */
    authorityChangeAction() {
        // If the authority changes...
        this.setCurrentAuthorityID(this.currentAuthorityID)
    }

    /*
    Load the taxon's status, synonyms, etc.
    */
    loadTaxonStatus(taxonID: number) {
        // First let's figure out if the taxon is accepted or not, let's fetch the status for the given taxaid
        // Is this taxon a synonym?
        this.taxonomicStatusService
            .findAll({taxonIDs: [+this.taxonID], taxonomicAuthorityID: this.currentAuthorityID} )
            .subscribe((myStatii) => {
                // There are statuses for each taxa authority, so let's break up the status per taxa authority
                const statusMap = new Map()
                myStatii.forEach((status) => {
                    // If we haven't yet seen the authority id, set up an empty list of statuses for it
                    if (!statusMap.has(status.taxonAuthorityID)) {
                        statusMap.set(status.taxonAuthorityID,[])
                        // Run through the entire list of taxonomic authorities and move this authority into the list
                        this.allTaxonomicAuthorityList.forEach((authority) => {
                            if (authority.id == status.taxonAuthorityID) {
                                this.taxonomicAuthorityList.unshift(authority)
                            }
                        })
                    }
                    // Sort the taxonomic list
                    this.taxonomicAuthorityList.sort(function (a, b) {
                        return (a.id > b.id ? 1 : -1)
                    })
                    // Add the status to the list of statuses for this authorityID
                    const statusList = statusMap.get(status.taxonAuthorityID)
                    statusList.push(status)
                    statusMap.set(status.taxonAuthorityID, statusList)
                })
                // Run through the authorities
                statusMap.forEach((statusList, authorityID) => {
                    if (statusList.length > 1) {
                        // In conflict! [TODO Add in conflict processing, basically should never happen]
                    } else if (statusList.length == 0) {
                        // database is corrupt [TODO how to fix corrupt data?]
                    } else {
                        const myStatus = statusList[0]
                        // Find the name of the accepted and parent taxons
                        this.taxaService.findByID(myStatus.taxonIDAccepted).subscribe((acceptedTaxon) => {
                            this.acceptedName.set(myStatus.taxonAuthorityID,acceptedTaxon.scientificName)
                            this.acceptedID.set(myStatus.taxonAuthorityID, acceptedTaxon.id)
                            this.parentName.set(myStatus.taxonAuthorityID,myStatus.parent.scientificName)
                            console.log(" name is " + myStatus.parentTaxonID)
                            this.parentID.set(myStatus.taxonAuthorityID, myStatus.parentTaxonID)
                            if (taxonID != myStatus.taxonIDAccepted) {
                                // I am a synonym, let's look for the accepted id taxon
                                this.isAccepted.set(myStatus.taxonAuthorityID,false)

                                // Trigger rebinding
                                this.setCurrentAuthorityID(this.currentAuthorityID)
                            } else {
                                // I am not a synonym, let's look to see if anyone is a synonym of me
                                this.isAccepted.set(myStatus.taxonAuthorityID,true)
                                console.log("synonomys ")
                                this.taxonomicStatusService.findSynonyms(taxonID,this.currentAuthorityID)
                                    .subscribe( (syn) => {
                                        this.synonymList = []
                                        console.log("syn " + syn.length)
                                        syn.forEach(function(synonym) {
                                            // Add the synonym to a list of synonyms

                                            const synonymItem = {
                                                name: synonym.taxon.scientificName,
                                                taxonID: synonym.taxon.id
                                            }

                                            this.synonymList.push(synonymItem)
                                        })
                                        // Sort the list of synonyms
                                        this.synonymList = this.synonymList.sort(function(a, b) {
                                            return 0 - (a.name > b.name ? 1 : -1)
                                        })
                                    })
                                /*
                                // Find the name of the accepted taxon
                                this.taxaService.findByIDWithSynonyms(taxonID)
                                    .subscribe((item) => {
                                        const statuses = item.acceptedTaxonStatuses
                                        statuses.forEach((status) => {
                                            status.taxonID
                                        })
                                 */
                                        //this.taxon = item
                                        /*
                                        const key = item.rankID + item.kingdomName
                                        //this.rankName = this.taxonomicUnitService.lookupRankName(item.rankID,item.kingdomName)
                                        this.ranksIDtoName = this.taxonomicUnitService.getRanksLookup()
                                        if (this.ranksIDtoName == null) {
                                            // First load the names of the ranks
                                            this.taxonomicUnitService.findAll().subscribe((ranks) => {
                                                ranks.forEach((rank) => {
                                                    this.ranksIDtoName.set(rank.rankID, rank.rankName)
                                                })
                                            })
                                            this.rankName = this.ranksIDtoName.has(key) ? this.ranksIDtoName.get(key) : 'unknown'
                                        } else {
                                            this.rankName = this.ranksIDtoName.has(key) ? this.ranksIDtoName.get(key) : 'unknown'
                                        }

                                         */

                                    //})
                                // Trigger rebinding
                                this.setCurrentAuthorityID(this.currentAuthorityID)
                            }
                        })
                    }
                })


            })
    }

    /*
    Call this whenever there is a change to the current authorityID
     */
    setCurrentAuthorityID(id) {
        this.currentParentName = this.parentName.get(id)
        this.currentParentID = this.parentID.get(id)
        this.currentAcceptedName = this.acceptedName.get(id)
        this.currentAcceptedID = this.acceptedID.get(id)
        this.currentSynonyms = this.synonyms.get(id)
        this.currentIsAccepted = this.isAccepted.get(id)
        this.currentAuthorityID = id
    }

    openDialog(action, obj) {
        obj.action = action
        obj.currentParentName = this.currentParentName
        obj.taxonomicAuthorityID = this.currentAuthorityID
        obj.taxonID = this.taxonID
        let dialogRef = null
        if (action == 'Update Parent') {
            dialogRef = this.dialog.open(TaxonStatusParentEditorDialogComponent, {
                width: '100',
                data: obj
            })
        } else if (action == 'Update Accepted') {
            dialogRef = this.dialog.open(TaxonStatusAcceptedEditorDialogComponent, {
                width: '100',
                data: obj
            })
        }
        dialogRef.afterClosed().subscribe(result => {
            if (result.event == 'Update Parent') {
                this.moveTaxonToNewParent(result.data)
            } else if (result.event == 'Update Accepted') {
                console.log(" event is " + result.event)
                if (result.data.action == "link") {
                    // Add the link
                    console.log(" adding link")
                } else if (result.data.action == "make accepted") {
                    if (result.data.switch) {
                        // Make this one accepted in a ring
                        this.updateAcceptedRing()
                    } else {
                        // Just change the status
                        this.updateToAccepted()
                    }
                } else {
                    // Error in the code, should never get here
                    console.warn("Error in the code, unsupported action")
                }
            } else {
                // Cancel was selected, do nothing
            }
        })
    }

    updateToAccepted() {
        this.taxonomicStatusService
            .updateToAccepted(this.taxonID, this.currentAuthorityID)
            .subscribe((status) => {
                if (status) {
                    // It has been updated in the database
                    this.showMessage("taxon.status.editor.updated.change.accepted")
                } else {
                    // [TODO fix since Error occurred]
                    this.showError("taxon.status.editor.updated.change.accepted.error")
                }
                // Reload the taxon
                this.loadTaxonStatus(+this.taxonID)
            })
    }

    updateAcceptedRing() {
        this.taxonomicStatusService
            .updateAcceptedRing(this.taxonID, this.currentAuthorityID, this.currentAcceptedID)
            .subscribe((status) => {
                if (status) {
                    // It has been updated in the database
                    this.showMessage("taxon.status.editor.updated.ring")
                } else {
                    // [TODO fix since Error occurred]
                    this.showError("taxon.status.editor.updated.ring.error")
                }
                // Reload the taxon
                this.loadTaxonStatus(+this.taxonID)
            })
    }

    moveTaxonToNewParent(newParent: string) {
        // Figure out taxon id for the new parent
        let children = []
        const childrenSynonyms = {}

        // Look up the scientific name first
        this.taxaService.findScientificName(newParent.trim(),this.currentAuthorityID)
            .subscribe((taxon) => {
                let parentTaxonID = taxon.id
                // Move in taxa enum tree
                this.taxonomicEnumTreeService.move(+this.taxonID, parentTaxonID, this.currentAuthorityID).subscribe((enumTree) => {
                    if (!enumTree) {
                        // [TODO fix since Error occurred]
                        this.showError("taxon.status.editor.updated.move.error")
                    }
                    // Update the parent to the new parent
                    this.taxonomicStatusService.findByID(+this.taxonID, +this.currentAuthorityID, this.currentAcceptedID).subscribe((status) => {
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
                                this.loadTaxonStatus(+this.taxonID)
                            })
                    })
                })
            })
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
