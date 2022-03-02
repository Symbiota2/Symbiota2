import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import {
    TaxonomicEnumTreeService, TaxonomicAuthorityService,
    TaxonomicStatusService, TaxonomicUnitService,
    TaxonService, TaxonVernacularService
} from '../../services';
import { BehaviorSubject } from 'rxjs'
import { TranslateService } from '@ngx-translate/core'
import { TaxonListItem, TaxonIDAuthorNameItem } from '../../dto';
import { filter } from 'rxjs/operators';
import { UserService } from '@symbiota2/ui-common';
import { TAXON_EDITOR_ROUTE_PREFIX } from '../../routes';

@Component({
    selector: 'taxa-utils-entry-page',
    templateUrl: './taxa-utils-entry-page.html',
    styleUrls: ['./taxa-utils-entry-page.scss'],
})

export class TaxaUtilsEntryPage implements OnInit {
    taxonomicAuthorityList
    taxonomicAuthorityID
    taxons = []
    taxon_editor_route = TAXON_EDITOR_ROUTE_PREFIX

    // User stuff
    userID : number = null
    userCanEdit: boolean = false

    constructor(
        private readonly userService: UserService,
        private readonly taxaService: TaxonService,
        private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        private readonly taxonomicStatusService: TaxonomicStatusService,
        private readonly taxonVernacularService: TaxonVernacularService,
        private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
        private readonly taxonomicUnitService: TaxonomicUnitService,
        private router: Router,
        private formBuilder: FormBuilder,
        private currentRoute: ActivatedRoute,
        private readonly translate: TranslateService
    ) {

    }

    /*
    Called when Angular starts
    */
    ngOnInit() {
        // Load the authorities
        this.loadAuthorities()

        // Load user
        this.userService.currentUser
            .pipe(filter((user) => user !== null))
            .subscribe((user) => {
                this.userID = user.uid
                this.userCanEdit = user.canEditTaxon(user.uid)
            })

    }


    /*
    Taxonomic authority has a new value
     */
    authorityChangeAction() {
        // If the authority changes...
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

    doRebuildTree() {
        this.taxonomicEnumTreeService.rebuildTree(this.taxonomicAuthorityID).subscribe((item) => {
            // [TODO - report error if did not return a result]
        })
    }

    findInConflict() {
        this.taxonomicStatusService.findInConflict(this.taxonomicAuthorityID).subscribe((items) => {
            const tids = []
            items.forEach((item) => {
                tids.push(item.taxonID)
            })
            this.taxaService.findAll(this.taxonomicAuthorityID,{taxonIDs: tids}).subscribe((taxons) => {
                this.taxons = taxons
            })
        })
    }

}
