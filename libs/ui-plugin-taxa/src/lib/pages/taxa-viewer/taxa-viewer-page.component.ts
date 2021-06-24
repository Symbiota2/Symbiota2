import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import {
    TaxonListItem, TaxonomicAuthorityService,
    TaxonomicStatusService,
    TaxonService, TaxonVernacularService
} from '@symbiota2/ui-plugin-taxa';
import { TaxonomicEnumTreeService } from '@symbiota2/ui-plugin-taxa'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

/**
 * Taxonomic data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface TaxonNode {
    name: string
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
    language = "none"
    kindOfName = "Scientific"
    languageList = []
    taxonomicAuthorityList = []
    taxonomicAuthorityID
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
        private currentRoute: ActivatedRoute
    ) {
        this.dataSource.data = []
    }

    // The vernacular language menu has a new choice
    languageChangeAction(language) {
        this.language = language
        this.loadCommonNames()
    }

    // The vernacular language menu has a new choice
    authorityChangeAction() {
        //this.taxonomicAuthorityID = authority
        console.log("current authority " + this.taxonomicAuthorityID)
        //console.log("new authority is " + authority)
        this.loadScientificNames()
    }

    // Called when the choice of scientific vs. common is changed
    configureChangeAction() {
        //console.log("change made " + this.kindOfName)
        if (this.kindOfName == 'Scientific') {
            this.loadScientificNames()
        } else {
            this.loadCommonNames()
        }
    }

    // Called when Angular starts
    ngOnInit() {

        // Set up a filter on the names to only show names after 2 chars are typed
        this.filteredOptions = this.nameControl.valueChanges.pipe(
            startWith(''),
            map((value) => (value.length >= 1 ? this._filter(value) : []))
        );

        // Get the common languages for display in the menu
        this.loadVernacularLanguages()

        // If default is scientific names, preload them
        if (this.kindOfName == 'Scientific') {
            this.loadAuthorities()
            this.loadKingdoms()
            this.loadScientificNames()
        } else {
            // Preload common names
            this.loadCommonNames()
        }

    }

    // Map value to lower case
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.nameOptions.filter(
            (option) => option.toLowerCase().indexOf(filterValue) === 0
        );
    }

    // Load the taxa authorities
    public loadAuthorities() {
        this.taxonomicAuthorityService.findAll().subscribe((authorities) => {
            this.taxonomicAuthorityList = authorities
        })
    }


    // Load the kingdoms
    public loadKingdoms() {

    }

    // Load the languages for vernacular names
    public loadVernacularLanguages() {
        this.taxonVernacularService.findAllLanguages().subscribe((language) => {
            this.languageList = language
        })
    }

    // Load the common names using the chosen language
    public loadCommonNames() {
        const language = this.language
        this.nameControl.setValue("")
        this.nameOptions = []

        // If the language is not set, load all of the common names
        if (this.language == "none") {
            this.taxonVernacularService.findAllCommonNames().subscribe((names) => {
                this.nameOptions = names
            })
        } else {
            this.taxonVernacularService.findAllCommonNamesByLanguage(language).subscribe((names) => {
                this.nameOptions = names
            })
        }

    }


    // Load all of the desired Scientific names into a list
    public loadScientificNames() {
        //this.hasAuthors = !this.hasAuthors
        this.nameControl.setValue("")
        this.nameOptions= []
        if (this.hasAuthors) {
            console.log("has authors")
            this.taxaService.findAllScientificNamesPlusAuthors(this.taxonomicAuthorityID).subscribe((names) => {
                this.nameOptions = names
            })
        } else {
            console.log(" no authors")
            this.taxaService.findAllScientificNames(this.taxonomicAuthorityID).subscribe((names) => {
                this.nameOptions = names
            })
        }

        console.log("options size is " + this.nameOptions.length)
    }

    hasNestedChild = (_: number, nodeData: TaxonNode) =>
        nodeData.children !== undefined ? nodeData.children.length > 0 : false

    // Find the children and ancestors for the given sciname
    private buildTree(sciname: string) {
        this.isLoading = true;
        let children = []
        const childrenSynonyms = {}

        // Look up the scientific name first
        this.taxaService.findScientificName(sciname,this.taxonomicAuthorityID).subscribe((taxon) => {
            this.taxon = taxon
            let taxonID = taxon.id
            let baseNode: TaxonNode = { name: sciname, expanded: true, synonym: false, children: []}

            // Is this taxon a synonym?
            this.taxonomicStatusService.findAll({taxonIDs: [taxon.id], taxonomicAuthorityID: this.taxonomicAuthorityID} ).subscribe((myStatii) => {
                myStatii.forEach((myStatus) => {
                    if (taxonID != myStatus.taxonIDAccepted) {
                        taxonID = myStatus.taxonIDAccepted
                        console.log("here")
                        console.log("mystatus " + myStatus.taxonIDAccepted)
                        this.taxaService.findByID(myStatus.taxonIDAccepted, this.taxonomicAuthorityID).subscribe( (myTaxon) => {
                            baseNode.name = myTaxon.scientificName
                            const synNode: TaxonNode = {name: sciname, expanded: false, synonym: true, children: []}
                            baseNode.children = [synNode]
                        })
                    }
                })
            })

            console.log(" name is " + sciname)
            // Build the children, first get the children
            this.taxonomicStatusService.findChildren(taxonID, this.taxonomicAuthorityID).subscribe((taxonStatii) => {
                // Need a list of the children tids to fetch their names
                const childrenTids = []
                taxonStatii.forEach(function (rec) {
                    //if (rec.taxonID !== taxon.id) childrenTids.push(rec.taxonID)
                    const acceptedId = rec.taxonIDAccepted
                    if (rec.taxonID !== acceptedId) {
                        // This is a synonym
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
                console.log(" tids " + childrenTids.length.toString())
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
                        console.log("pushing " + r.scientificName)
                        children.push(r.scientificName)
                        // Update the synonym map with the sciname
                        if (childrenSynonyms[r.id]) {
                            childrenSynonyms[r.scientificName] = childrenSynonyms[r.id]
                            delete childrenSynonyms[r.id]
                        }
                    })

                    // Children array is the scientific names of the children
                    children = children.sort(function (a, b) {
                        return a - b
                    }).map(function (a) {
                        console.log("adding child " + a)
                            const item: TaxonNode = {
                                name: a,
                                expanded: false,
                                synonym: false,
                                children: []
                            }
                            return item
                    })

                    children.forEach((childItem) => {

                        console.log("trying child " + childItem.name)

                        if (childrenSynonyms[childItem.name]) {

                            console.log("has synonym " + childItem.name)
                            const childList = []
                            this.taxaService.findAll(this.taxonomicAuthorityID,{ taxonIDs: childrenSynonyms[childItem.name] }).subscribe((s) => {

                                s.forEach(function(synonym) {
                                    // Add the synonym to a list of children
                                    const childItem: TaxonNode = {
                                        name: synonym.scientificName,
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
                    //baseNode.children.concat(children)
                    //const baseNode: TaxonNode = { name: sciname, expanded: true, synonym: false, children: children}

                    // Fetch ancestors
                    this.fetchAncestors(taxonID,baseNode)

                })
            })
        })
    }

    // Grab the ancestors for a given taxonid, and use the baseNode for the children
    private fetchAncestors(taxonid, baseNode) {

        // Find the ancestors
        this.taxonomicEnumTreeService
            .findAncestorTaxons(taxonid)
            .subscribe((ancTaxa) => {
                const newTree = ancTaxa
                    .sort(function (a, b) {
                        return b.rankID - a.rankID;
                    })
                    .reduce<any[]>((a, b) => {
                        // Check to see if this name is a duplicate
                        console.log("name is " + b.scientificName)
                        if (b.scientificName == a[0].name) {
                            return a  // Yes a duplicate, so skip
                        }
                        // Build a new parent node
                        const item: TaxonNode = {
                            name: b.scientificName,
                            expanded: true,
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
        this.taxonVernacularService.findCommonName(name).subscribe((taxon) => {
            //this.taxon = taxon

            const tid = taxon.taxonID

            // lookup its name by tid
            this.taxaService.findByID(tid, this.taxonomicAuthorityID).subscribe((taxonRec) => {

                // Go find the ancestors for this name
                this.buildTree(taxonRec.scientificName)
            })
        })
    }

    // Repaint the taxonomy tree in the browser
    private refreshTree() {
        // Cache the current tree
        const tree = this.dataSource.data
        // Trigger a change to the tree
        this.dataSource.data = []
        // Trigger another change, redraw cached tree
        this.dataSource.data = tree
    }

    // Expand a node in the tree by finding its children
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
                const children = []

                // Look up the names by their ids
                this.taxaService.findAll(this.taxonomicAuthorityID,{ taxonIDs: childrenTids }).subscribe((t) => {
                    t.forEach(function(r) {
                        children.push(r.scientificName)
                    })

                    // Sort and format the children as tree nodes
                    const childrenTree = []
                    children.sort().forEach((name) => {
                        const baseNode: TaxonNode = { name: name, expanded: false, synonym: false, children: [] }
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
        console.log(" foo " + node.name)
        this.findChildren(node)
    }

    onSubmit(): void {
        //TREE_DATA = []
        this.dataSource.data = []
        if (this.kindOfName == 'Scientific') {
            const sname = this.hasAuthors? this.nameControl.value.split(' -')[0] : this.nameControl.value
            this.buildTree(sname)
        } else {
            this.findCommonAncestors(this.nameControl.value)
        }

    }

    async onSwitchPage(page: number) {
        await this.router.navigate([], {
            relativeTo: this.currentRoute,
            queryParams: {
                page: page,
            },
        });
    }

    async onPrevious() {
        return this.onSwitchPage(this.currentPage - 1);
    }

    async onNext() {
        return this.onSwitchPage(this.currentPage + 1);
    }
}
