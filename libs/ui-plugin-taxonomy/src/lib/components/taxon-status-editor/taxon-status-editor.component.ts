import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    TaxonListItem, TaxonomicStatusService, TaxonomicUnitService,
    TaxonService,
    TaxonTaxonDialogComponent
} from '@symbiota2/ui-plugin-taxonomy';
import { TranslateService } from '@ngx-translate/core'
import { MatDialog } from '@angular/material/dialog';
import { AlertService, UserService } from '@symbiota2/ui-common';
import { filter } from 'rxjs/operators';
import { TaxonInputDto } from '../../dto/taxonInputDto';

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
    parentName = new Map<number,string>()
    synonyms = new Map<number,string[]>()

    // Binding cannot happen with Maps, so have to set up a current state
    currentAuthorityID = 1  // [TODO set up a default value somewhere]
    currentParentName = "unknown parent"
    currentIsAccepted = false
    currentSynonyms = []
    currentAcceptedName = "unknown name"

    taxon: TaxonListItem
    dataSource
    private taxonID: string
    private idCounter = 0
    userID : number = null
    userCanEdit: boolean = false
    ranksIDtoName = new Map()
    rankName = ""
    statuses = []

    constructor(
        private readonly userService: UserService,
        //private readonly taxonBlockService: TaxonDescriptionBlockService,
        private readonly taxaService: TaxonService,
        private readonly taxonomicUnitService: TaxonomicUnitService,
        //private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        private readonly taxonomicStatusService: TaxonomicStatusService,
        //private readonly taxonVernacularService: TaxonVernacularService,
        //private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
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
        this.synonyms.set(this.currentAuthorityID, [])
        this.parentName.set(this.currentAuthorityID, 'unknown')

        this.currentRoute.paramMap.subscribe(params => {
            this.taxonID = params.get('taxonID')
            // Load the taxon
            this.loadTaxonStatus(parseInt(this.taxonID))
        })

        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditTaxon(user.uid)
            })
    }

    /*
    Load the taxon's status, synonyms, etc.
    */
    loadTaxonStatus(taxonID: number) {
        // First let's figure out if the taxon is accepted or not, let's fetch the status for the given taxaid
        // Is this taxon a synonym?
        this.taxonomicStatusService.findAll(
            {taxonIDs: [+this.taxonID], taxonomicAuthorityID: this.currentAuthorityID} )
            .subscribe((myStatii) => {
                if (myStatii.length > 1) {
                    // In conflict! [TODO Add in conflict processing, basically should never happen]
                }
                myStatii.forEach((myStatus) => {
                    if (taxonID != myStatus.taxonIDAccepted) {
                        // I am a synonym, let's look for the accepted id taxon
                        this.taxaService.findByID(myStatus.taxonIDAccepted, this.currentAuthorityID)
                            .subscribe((myTaxon) => {


                            })
                    }
                })
            })


        this.taxaService.findByIDWithSynonyms(taxonID)
            .subscribe((item) => {
                //console.log("loading taxon " + item.scientificName)
                this.taxon = item
                const key = item.rankID + item.kingdomName
                //this.rankName = this.taxonomicUnitService.lookupRankName(item.rankID,item.kingdomName)
                this.ranksIDtoName = this.taxonomicUnitService.getRanksLookup()
                if (this.ranksIDtoName == null) {
                    // First load the names of the ranks
                    this.taxonomicUnitService.findAll().subscribe((ranks) => {
                        ranks.forEach((rank) => {
                            this.ranksIDtoName.set(rank.rankID,rank.rankName)
                        })
                    })
                    this.rankName = this.ranksIDtoName.has(key) ? this.ranksIDtoName.get(key) : 'unknown'
                } else {
                    this.rankName = this.ranksIDtoName.has(key) ? this.ranksIDtoName.get(key) : 'unknown'
                }
                //("statuses " + item.acceptedTaxonStatuses)
                this.statuses = (item.acceptedTaxonStatuses) ? item.acceptedTaxonStatuses : []
                this.statuses.forEach((status) => {
                    if (status.taxonID == status.taxonIDAccepted) {
                        // this is accepted status

                    }
                    //console.log(" authority is " + status.taxonAuthorityID)
                    //(" parent is " + status.parentTaxonID)
                    this.taxaService.findByID(status.parentTaxonID).subscribe((parentTaxon) => {
                        //console.log(" parentTaxonName is " +  parentTaxon.scientificName)
                        this.parentName.set(status.taxonAuthorityID,parentTaxon.scientificName)
                        if (status.taxonID == status.taxonIDAccepted) {
                            // is accepted
                            console.log(" is accepted ")
                            this.isAccepted.set(status.taxonAuthorityID,true)
                            this.taxonomicStatusService
                                .findSynonyms(status.taxonID,status.taxonAuthorityID)
                                .subscribe((synonyms) => {
                                    synonyms.forEach((synonym) => {
                                        if (!this.synonyms.has(status.taxonAuthorityID)) {
                                            this.synonyms.set(status.taxonAuthorityID, [])
                                        }
                                        const names = this.synonyms.get(status.taxonAuthorityID)
                                        names.push(synonym.taxon.scientificName)
                                    })
                                })
                        } else {
                            console.log(" synonomy " + status.taxonIDAccepted)
                            this.isAccepted.set(status.taxonAuthorityID,false)
                            // Find the name of the accepted taxon
                            this.taxaService.findByID(status.taxonIDAccepted).subscribe((acceptedTaxon) => {
                                //console.log("setting name " + status.taxonAuthorityID, acceptedTaxon.scientificName)
                                this.acceptedName.set(status.taxonAuthorityID,acceptedTaxon.scientificName)
                            })
                        }
                        // Trigger rebinding
                        this.setCurrentAuthorityID(this.currentAuthorityID)
                    })
                })
            })

    }

    /*
    Call this whenever there is a change to the current authorityID
     */
    setCurrentAuthorityID(id) {

        this.currentParentName = this.parentName.get(id)
        this.currentAcceptedName = this.acceptedName.get(id)
        this.currentSynonyms = this.synonyms.get(id)
        this.currentIsAccepted = this.isAccepted.get(id)
        //console.log("setting authority id " + this.currentParentName)
    }

    openDialog(action, obj) {
        obj.action = action
        const dialogRef = (action == 'Delete') ?
            this.dialog.open(TaxonTaxonDialogComponent, {
                width: '100',
                data: obj
            })
            : this.dialog.open(TaxonTaxonDialogComponent, {
                width: '80%',
                data: obj
            })

        dialogRef.afterClosed().subscribe(result => {
            if (result.event == 'Update') {
                this.updateData(result.data)
            }
        })
    }

    updateData(obj) {
        // Copy data to current state
        this.taxon.scientificName = obj.scientificName
        this.taxon.unitName1 = obj.unitName1
        this.taxon.unitName2 = obj.unitName2
        this.taxon.unitName3 = obj.unitName3
        this.taxon.kingdomName = obj.kingdomName
        this.taxon.rankID = obj.rankID
        this.taxon.author = obj.author
        this.taxon.phyloSortSequence = obj.phyloSortSequence
        this.taxon.status = obj.status
        this.taxon.source = obj.source
        this.taxon.notes = obj.notes
        this.taxon.hybrid = obj.hybrid
        this.taxon.securityStatus = obj.securityStatus
        // Construct a new taxon
        const data = {
            id: this.taxonID,
            scientificName: obj.scientificName,
            unitName1: obj.unitName1,
            unitName2: obj.unitName2,
            unitName3: obj.unitName3,
            kingdomName: obj.kingdomName,
            rankID: obj.rankID,
            author: obj.author,
            phyloSortSequence: obj.phyloSortSequence,
            status: obj.status,
            source: obj.source,
            notes: obj.notes,
            hybrid: obj.hybrid,
            securityStatus: obj.securityStatus,
            initialTimestamp: new Date()
        }
        const newTaxon = new TaxonInputDto(data)
        this.taxaService
            .update(new TaxonInputDto(data))
            .subscribe((taxon)=> {
                if (taxon) {
                    // It has been updated in the database
                    this.showMessage("taxon.editor.updated")
                } else {
                    // Error in adding
                    this.showError("taxon.editor.updated.error")
                }
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
