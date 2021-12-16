import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import {
    TaxonListItem, TaxonomicAuthorityService,
    TaxonomicStatusService, TaxonomicUnitService,
    TaxonService, TaxonVernacularService
} from '@symbiota2/ui-plugin-taxonomy';
import { TaxonomicEnumTreeService } from '@symbiota2/ui-plugin-taxonomy'
import { BehaviorSubject } from 'rxjs'
import { TranslateService } from '@ngx-translate/core'
import { TAXON_EDITOR_ROUTE_PREFIX, TAXON_PROFILE_ROUTE_PREFIX } from '../../routes';

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
    selector: 'taxa-editor-entry-page',
    templateUrl: './taxa-editor-entry-page.html',
    styleUrls: ['./taxa-editor-entry-page.scss'],
})

export class TaxaEditorEntryPage implements OnInit {
    nameControl = new FormControl()
    nameOptions: string[] = []
    hasAuthors = false
    includeAuthors = false
    language = "none"
    kindOfName = "Scientific"
    languageList = []
    taxonomicAuthorityList = []
    taxonomicAuthorityID = 1 // Default set in nginit
    treeControl = new NestedTreeControl<TaxonNode>((node) => node.children);
    dataSource = new MatTreeNestedDataSource<TaxonNode>()
    dataChange = new BehaviorSubject<TaxonNode[]>([])
    public taxa = []
    public names = []
    private isLoading = false
    isNotExpanded = ( node: TaxonNode) =>
        !node.expanded //&& !!node.children && node.children.length > 0;
    isSynonym = ( node: TaxonNode) => node.synonym
    hasNestedChild = (_: number, nodeData: TaxonNode) =>
        nodeData.children !== undefined ? nodeData.children.length > 0 : false
    private taxon: TaxonListItem
    nameFound = false
    looking = false
    possibleTaxons  = []

    constructor(
        //private readonly userService: UserService,  // TODO: needed for species hiding
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
        this.dataSource.data = []
    }

    /*
    Called when Angular starts
    */
    ngOnInit() {
        // Load the authorities
        this.loadAuthorities()

        // Get the common languages for display in the menu
        this.loadVernacularLanguages()
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
        this.looking = false
        this.language = language
    }

    /*
    Taxonomic authority has a new value
     */
    authorityChangeAction() {
        this.looking = false
        // If the authority changes...
    }

    /*
    Reload the names as needed
     */
    loadNames(partialName) {
        this.looking = false
        if (this.kindOfName == 'Scientific') {
            this.loadScientificNames(partialName)
        } else {
            this.loadCommonNames(partialName)
        }
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
        this.looking = false
        if (event.target.value) {
            const partialName = event.target.value
            this.loadNames(partialName)
        }
    }

    /*
    Load the taxa authorities
     */
    public loadAuthorities() {
        this.taxonomicAuthorityService.findAll()
            .subscribe((authorities) => {
            this.taxonomicAuthorityList = authorities
        })
        this.taxonomicAuthorityList.sort(function (a, b) {
            return (a.id > b.id ? 1 : -1)
        })
        this.taxonomicAuthorityList.forEach((authority) => {
            if (authority.isPrimay) {
                this.taxonomicAuthorityID = authority.id
            }
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
    Goto the given page
     */
    private followLink(taxonID: number) {
        this.router.navigateByUrl(TAXON_EDITOR_ROUTE_PREFIX+'/'+taxonID.toString())
    }

    private findCommonAncestors(name: string) {
        this.looking = true

        // Look up the common name first
        this.taxonVernacularService
            .findByCommonName(name, this.taxonomicAuthorityID)
            .subscribe((items) => {
                if (items.length == 0) {
                    this.nameFound = false
                } else if (items.length > 2) {
                    this.nameFound = true
                    // Need to build a list of taxons to select
                    // lookup its name by tid
                    this.possibleTaxons = []
                    items.forEach((item) => {
                        this.taxaService.findByID(item.taxonID, this.taxonomicAuthorityID)
                            .subscribe((taxon) => {
                                // Found a synonym, add it to the list of synonyms
                                const taxonItem: TaxonNode = {
                                    name: taxon.scientificName,
                                    taxonID: item.taxonID,
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
                    const item = items[0]
                    if (item) {
                        this.nameFound = true
                        const tid = item.taxonID

                        // lookup its name by tid
                        this.taxaService.findByID(tid, this.taxonomicAuthorityID)
                            .subscribe((taxonRec) => {

                                // Go find the ancestors for this name
                                this.followLink(taxonRec.id)
                            })
                    } else {
                        // Only if list has a null value, which is not possible?
                        this.nameFound = false
                    }
                }
        })
    }

    /*
    Repaint the taxonomy tree in the browser
     */
    private refreshTree() {
        // Cache the current tree
        const tree = this.dataSource.data
        // Trigger a change to the tree
        this.dataSource.data = []
        // Trigger another change, redraw cached tree
        this.dataSource.data = tree
    }

    /*
    Called when the taxon is chosen to display
     */
    onSubmit(): void {
        this.nameFound = true
        this.dataSource.data = []
        if (this.kindOfName == 'Scientific') {
            const sname = this.hasAuthors? this.nameControl.value.split(' -')[0] : this.nameControl.value
            this.nameListCheck(sname)
        } else {
            this.findCommonAncestors(this.nameControl.value)
        }

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
                        this.followLink(+taxon.id)
                    } else {
                        // Should never get here
                        this.nameFound = false
                    }
                }
            })
    }
}
