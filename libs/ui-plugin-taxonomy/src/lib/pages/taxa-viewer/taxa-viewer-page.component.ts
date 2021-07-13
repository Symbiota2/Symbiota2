import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import {
    TaxonListItem, TaxonomicAuthorityService,
    TaxonomicStatusService,
    TaxonService, TaxonVernacularService
} from '@symbiota2/ui-plugin-taxonomy';
import { TaxonomicEnumTreeService } from '@symbiota2/ui-plugin-taxonomy'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { TranslateService } from '@ngx-translate/core'

/**
 * Taxonomic data with nested structure.
 * Each node has a name and an optional list of children.
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
    selector: 'taxa-viewer',
    templateUrl: './taxa-viewer-page.html',
    styleUrls: ['./taxa-viewer-page.component.scss'],
})

export class TaxaViewerPageComponent implements OnInit {
    nameControl = new FormControl()
    nameOptions: string[]
    hasAuthors = false
    includeAuthors = false
    language = "none"
    kindOfName = "Scientific"
    languageList = []
    taxonomicAuthorityList = []
    taxonomicAuthorityID = 1 // Set the default taxa authority id
    filteredOptions: Observable<string[]>
    treeControl = new NestedTreeControl<TaxonNode>((node) => node.children);
    dataSource = new MatTreeNestedDataSource<TaxonNode>()
    dataChange = new BehaviorSubject<TaxonNode[]>([])
    public taxa = []
    public names = []
    private isLoading = false
    isNotExpanded = ( node: TaxonNode) =>
        !node.expanded //&& !!node.children && node.children.length > 0;
    isSynonym = ( node: TaxonNode) =>
        node.synonym
    public readonly PAGE_SEARCH_CRITERIA = 0
    public readonly PAGE_SEARCH_RESULTS = 1
    public currentPage = this.PAGE_SEARCH_CRITERIA
    private taxon: TaxonListItem

    constructor(
        //private readonly userService: UserService,  // TODO: needed for species hiding
        private readonly taxaService: TaxonService,
        private readonly taxonomicEnumTreeService: TaxonomicEnumTreeService,
        private readonly taxonomicStatusService: TaxonomicStatusService,
        private readonly taxonVernacularService: TaxonVernacularService,
        private readonly taxonomicAuthorityService: TaxonomicAuthorityService,
        private router: Router,
        private formBuilder: FormBuilder,
        private currentRoute: ActivatedRoute,
        private readonly translate: TranslateService
    ) {
        this.dataSource.data = []
    }

    /*
    The vernacular language menu has a new choice
     */
    languageChangeAction(language) {
        this.language = language
        this.loadCommonNames()
    }

    /*
    Taxonomic authority has a new value
     */
    authorityChangeAction() {
        // If the authority changes
        this.loadNames()
    }

    /*
    Reload the names as needed
     */
    loadNames() {
        if (this.kindOfName == 'Scientific') {
            this.loadScientificNames()
        } else {
            this.loadCommonNames()
        }
    }

    /*
    Called when the choice of scientific vs. common is changed
     */
    configureChangeAction() {
        this.loadNames()
    }

    /*
    Called when Angular starts
     */
    ngOnInit() {

        // Set up a filter on the names to only show names after 2 chars are typed
        this.filteredOptions = this.nameControl.valueChanges.pipe(
            startWith(''),
            map((value) => (value.length >= 1 ? this._filter(value) : []))
        );

        // Load the authorities
        this.loadAuthorities()

        // Get the common languages for display in the menu
        this.loadVernacularLanguages()

        // Load the names for the name completion list
        this.loadNames()

    }

    /*
    Map value to lower case
     */
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.nameOptions.filter(
            (option) => option.toLowerCase().indexOf(filterValue) === 0
        );
    }

    /*
    Load the taxa authorities
     */
    public loadAuthorities() {
        this.taxonomicAuthorityService.findAll().subscribe((authorities) => {
            this.taxonomicAuthorityList = authorities
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
        this.taxonVernacularService.findAllLanguages(this.taxonomicAuthorityID).subscribe((language) => {
            this.languageList = language
        })
    }

    /*
    Load the common names using the chosen language
     */
    public loadCommonNames() {
        const language = this.language
        this.nameControl.setValue("")
        this.nameOptions = []

        // If the language is not set, load all of the common names
        if (this.language == "none") {
            this.taxonVernacularService.findAllCommonNames(this.taxonomicAuthorityID).subscribe((names) => {
                this.nameOptions = names
            })
        } else {
            this.taxonVernacularService.findAllCommonNamesByLanguage(language, this.taxonomicAuthorityID).subscribe((names) => {
                this.nameOptions = names
            })
        }

    }

    /*
    Load all of the desired Scientific names into a list
     */
    public loadScientificNames() {
        this.nameControl.setValue("")
        this.nameOptions= []
        if (this.hasAuthors) {
            this.taxaService.findAllScientificNamesPlusAuthors(this.taxonomicAuthorityID).subscribe((names) => {
                this.nameOptions = names
            })
        } else {
            this.taxaService.findAllScientificNames(this.taxonomicAuthorityID).subscribe((names) => {
                this.nameOptions = names
            })
        }
    }

    hasNestedChild = (_: number, nodeData: TaxonNode) =>
        nodeData.children !== undefined ? nodeData.children.length > 0 : false

    /*
    Find the children and ancestors for the given sciname
     */
    private buildTree(sciname: string) {
        this.isLoading = true;
        let children = []
        const childrenSynonyms = {}

        // Look up the scientific name first
        this.taxaService.findScientificName(sciname,this.taxonomicAuthorityID).subscribe((taxon) => {
            this.taxon = taxon
            let taxonID = taxon.id
            let baseNode: TaxonNode = { name: sciname, taxonID: taxonID, author: taxon.author, expanded: true, synonym: false, children: []}

            // Is this taxon a synonym?
            this.taxonomicStatusService.findAll({taxonIDs: [taxon.id], taxonomicAuthorityID: this.taxonomicAuthorityID} ).subscribe((myStatii) => {
                myStatii.forEach((myStatus) => {
                    if (taxonID != myStatus.taxonIDAccepted) {
                        //console.log("Found synonym " + taxonID)
                        taxonID = myStatus.taxonIDAccepted
                        this.taxaService.findByID(myStatus.taxonIDAccepted, this.taxonomicAuthorityID).subscribe( (myTaxon) => {
                            baseNode.name = myTaxon.scientificName
                            baseNode.taxonID = myTaxon.id
                            const synNode: TaxonNode = {name: sciname, taxonID: myTaxon.id, author: myTaxon.author, expanded: false, synonym: true, children: []}
                            baseNode.children = [synNode]
                        })
                    }
                })
            })

            // Build the children, first get the children
            this.taxonomicStatusService.findChildren(taxonID, this.taxonomicAuthorityID).subscribe((taxonStatii) => {
                // Need a list of the children tids to fetch their names
                const childrenTids = []
                taxonStatii.forEach(function (rec) {
                    //if (rec.taxonID !== taxon.id) childrenTids.push(rec.taxonID)
                    const acceptedId = rec.taxonIDAccepted
                    if (rec.taxonID !== acceptedId) {
                        // This is a synonym
                        //console.log("found child synonym " + rec.taxonID)
                        if (childrenSynonyms[acceptedId]) {
                            // Have seen this accepted name before
                            childrenSynonyms[acceptedId].concat(rec.taxonID)
                        } else {
                            childrenTids.push(acceptedId)
                            childrenSynonyms[acceptedId] = [rec.taxonID]
                        }
                    } else {
                        childrenTids.push(rec.taxonID)
                    }
                })

                // Fetch the scientific names of the children
                if (childrenTids.length == 0) {

                    // There are no children
                    //const baseNode: TaxonNode = { name: sciname, expanded: true, synonym: false, children: []}

                    // Fetch ancestors
                    this.fetchAncestors(taxon.id, baseNode)
                    return
                }

                // Get the names of the children
                this.taxaService.findAll(this.taxonomicAuthorityID,{taxonIDs: childrenTids}).subscribe((t) => {
                    t.forEach(function (r) {
                        //console.log(" name is " + r.scientificName)
                        const child : TaxonNode = {
                            name: r.scientificName,
                            taxonID: r.id,
                            author: r.author,
                            expanded: false,
                            synonym: false,
                            children: []
                        }
                        children.push(child)
                        // Update the synonym map with the sciname
                        if (childrenSynonyms[r.id]) {
                            childrenSynonyms[r.scientificName] = childrenSynonyms[r.id]
                            delete childrenSynonyms[r.id]
                        }
                    })

                    // Children array is the scientific names of the children
                    children = children.sort(function (a, b) {
                        return a.name - b.name
                    })

                    children.forEach((childItem) => {
                        if (childrenSynonyms[childItem.name]) {
                            const childList = []
                            this.taxaService.findAll(this.taxonomicAuthorityID,{ taxonIDs: childrenSynonyms[childItem.name] }).subscribe((s) => {

                                s.forEach(function(synonym) {
                                    // Add the synonym to a list of children
                                    const childItem: TaxonNode = {
                                        name: synonym.scientificName,
                                        taxonID: synonym.id,
                                        author: synonym.author,
                                        expanded: false,
                                        synonym: true,
                                        children: []
                                    }

                                    childList.push(childItem)
                                })
                            })
                            childItem.children = childList
                        }
                        baseNode.children.push(childItem)
                    })

                    baseNode.synonym = false
                    baseNode.expanded = true

                    // Fetch ancestors
                    this.fetchAncestors(taxonID,baseNode)

                })
            })
        })
    }

    /*
    Grab the ancestors for a given taxonid, and use the baseNode for the children
     */
    private fetchAncestors(taxonid, baseNode) {

        // Find the ancestors
        this.taxonomicEnumTreeService
            .findAncestorTaxons(taxonid, this.taxonomicAuthorityID)
            .subscribe((ancTaxa) => {
                const newTree = ancTaxa
                    .sort(function (a, b) {
                        return b.rankID - a.rankID;
                    })
                    .reduce<any[]>((a, b) => {
                        // Check to see if this name is a duplicate
                        if (b.scientificName == a[0].name) {
                            return a  // Yes a duplicate, so skip
                        }
                        // Build a new parent node
                        const item: TaxonNode = {
                            name: b.scientificName,
                            taxonID: b.id,
                            author: b.author,
                            expanded: false,
                            synonym: false,
                            children: a,
                        }
                        return [item]
                    }, [baseNode])

                // We have all of the ancestors in the tree
                this.dataSource.data =  newTree

            })

    }

    private findCommonAncestors(name: string) {
        this.isLoading = true;

        // Look up the common name first
        this.taxonVernacularService.findCommonName(name, this.taxonomicAuthorityID).subscribe((taxon) => {
            //this.taxon = taxon

            const tid = taxon.taxonID

            // lookup its name by tid
            this.taxaService.findByID(tid, this.taxonomicAuthorityID).subscribe((taxonRec) => {

                // Go find the ancestors for this name
                this.buildTree(taxonRec.scientificName)
            })
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
    Expand a node in the tree by finding its children
     */
    private findChildren(node: TaxonNode) {

        let childrenTids  = []

        // Match the name to a taxon id
        this.taxaService.findScientificName(node.name, this.taxonomicAuthorityID).subscribe((taxon) => {

            // The status table has the direct parent, so lookup its children there
            this.taxonomicStatusService.findChildren(taxon.id, this.taxonomicAuthorityID).subscribe((taxonStatus) => {

                // For each one found, add its list of taxon ids to the children list
                // TODO: should this be just one, due to taxa authority id?
                taxonStatus.forEach(function(rec) {
                    childrenTids = childrenTids.concat(rec.taxonID.toString())
                })

                // Check to see if there are any children
                if (childrenTids.length == 0) {
                    // There are no children (current node is a leaf node)
                    // Mark that current node should be expanded to show children
                    node.expanded = true

                    // Redraw the tree and exit
                    this.refreshTree()
                    return
                }

                // Need to build up list of children names
                let children = []

                // Look up the names by their ids
                this.taxaService
                    .findAll(this.taxonomicAuthorityID,{ taxonIDs: childrenTids })
                    .subscribe((t) => {
                        /*
                    t.forEach(function(r) {
                        children.push(r.scientificName)
                    })
                         */
                        children = t

                    // Sort and format the children as tree nodes
                    const childrenTree = []
                    children.sort((a,b) => a.scientificName - b.scientificName).forEach((item) => {
                        //console.log(" what is name " + item.scientificName)
                        const baseNode: TaxonNode = {
                            name: item.scientificName,
                            taxonID: item.id,
                            author: item.author,
                            expanded: false,
                            synonym: false,
                            children: [] }
                        childrenTree.push(baseNode)
                    })

                    // Update the current node with its new children
                    node.children = childrenTree
                    node.expanded = true

                        // Refresh the tree
                    this.refreshTree()
                })
            })
        })
    }

    @ViewChild('tree') tree

    loadChildren(node: TaxonNode) : void {
        this.findChildren(node)
    }

    /*
    Called when the taxon is chosen to display
     */
    onSubmit(): void {
        this.dataSource.data = []
        if (this.kindOfName == 'Scientific') {
            const sname = this.hasAuthors? this.nameControl.value.split(' -')[0] : this.nameControl.value
            this.buildTree(sname)
        } else {
            this.findCommonAncestors(this.nameControl.value)
        }

    }

    /*
    Not used, probably can delete

    async onSwitchPage(page: number) {
        await this.router.navigate([], {
            relativeTo: this.currentRoute,
            queryParams: {
                page: page,
            },
        })
    }

     */

    /*
    Not used, probably can delete

    async onPrevious() {
        return this.onSwitchPage(this.currentPage - 1);
    }

     */

    /*
    Not used, probably can delete

    async onNext() {
        return this.onSwitchPage(this.currentPage + 1)
    }

     */
}
