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
    selector: 'taxa-viewer',
    templateUrl: './taxa-viewer-page.html',
    styleUrls: ['./taxa-viewer-page.component.scss'],
})

export class TaxaViewerPageComponent implements OnInit {
    nameControl = new FormControl()
    nameOptions: string[] = []
    hasAuthors = false
    includeAuthors = false
    language = "none"
    kindOfName = "Scientific"
    languageList = []
    taxonomicAuthorityList = []
    taxonomicAuthorityID = 1 // Set the default taxa authority id
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
        this.language = language
    }

    /*
    Taxonomic authority has a new value
     */
    authorityChangeAction() {
        // If the authority changes...
    }

    /*
    Reload the names as needed
     */
    loadNames(partialName) {
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
    Find the children and ancestors for the given sciname
     */
    private buildTree(sciname: string) {
        this.isLoading = true;
        let children = []
        const childrenSynonyms = {}

        // Look up the scientific name first
        this.taxaService.findScientificName(sciname.trim(),this.taxonomicAuthorityID)
            .subscribe((taxon) => {
            this.taxon = taxon
            let taxonID = taxon.id
            let baseNode: TaxonNode = { name: sciname, taxonID: taxonID, author: taxon.author, expanded: true, synonym: false, children: []}

            // Is this taxon a synonym?
            this.taxonomicStatusService.findAll(
                {taxonIDs: [taxon.id], taxonomicAuthorityID: this.taxonomicAuthorityID} )
                .subscribe((myStatii) => {
                myStatii.forEach((myStatus) => {
                    if (taxonID != myStatus.taxonIDAccepted) {
                        // I am a synonym, let's look for the accepted id information
                        taxonID = myStatus.taxonIDAccepted
                        this.taxaService.findByID(myStatus.taxonIDAccepted, this.taxonomicAuthorityID)
                            .subscribe( (myTaxon) => {
                                baseNode.name = myTaxon.scientificName
                                baseNode.taxonID = myTaxon.id
                                // Remove the synNode, taken care of below in processing children?
                                //const synNode: TaxonNode = {name: sciname, taxonID: taxon.id, author: taxon.author, expanded: false, synonym: true, children: []}
                                //baseNode.children = [synNode]
                                baseNode.children = []
                                baseNode.expanded = true
                                baseNode.synonym = false
                        })
                    }
                })
                // Build the children, first get the children
                this.taxonomicStatusService.findChildren(taxonID, this.taxonomicAuthorityID)
                    .subscribe((taxonStatii) => {
                    // Need a list of the children tids to fetch their names
                    const childrenTids = []
                    taxonStatii.forEach(function (rec) {
                        const acceptedId = rec.taxonIDAccepted
                        if (rec.taxonID !== acceptedId) {
                            // This is a synonym
                            if (childrenSynonyms[acceptedId]) {
                                // Have seen this accepted name before
                                childrenSynonyms[acceptedId].concat(rec.taxonID)
                            } else {
                                //childrenTids.push(acceptedId)
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
                        this.fetchSynonyms(taxon.id, baseNode)
                        return
                    }

                    // Get the names of the children
                    this.taxaService.findAll(this.taxonomicAuthorityID,{taxonIDs: childrenTids})
                        .subscribe((t) => {
                        t.forEach(function (r) {
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
                            return (a.name > b.name ? 1 : -1)
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

                        //this.fetchAncestors(taxonID,baseNode)
                        this.fetchSynonyms(taxonID, baseNode)
                    })
                })
            })
        })

    }

    /*
    Grab the synonyms for the current node and then go on and grab the ancestors
     */
    private fetchSynonyms(taxonid, baseNode) {
        this.taxonomicStatusService.findSynonyms(baseNode.taxonID,this.taxonomicAuthorityID)
            .subscribe( (syn) => {
            let synonymList = []
            syn.forEach(function(synonym) {
                // Add the synonym to a list of synonyms
                const synonymItem: TaxonNode = {
                    name: synonym.taxon.scientificName,
                    taxonID: synonym.taxon.id,
                    author: synonym.taxon.author,
                    expanded: false,
                    synonym: true,
                    children: []
                }

                synonymList.push(synonymItem)
            })
            // Sort the list of synonyms
            synonymList = synonymList.sort(function (a, b) {
                return 0 - (a.name > b.name ? 1 : -1)
            })

            // Add to children of the baseNode
            synonymList.forEach((syn) => {
                baseNode.children.unshift(syn)
            })
            // Fetch ancestors
            this.fetchAncestors(taxonid,baseNode)
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
                    .map((item) => {
                        const itemNode: TaxonNode = {
                            name: item.scientificName,
                            taxonID: item.id,
                            author: item.author,
                            expanded: false,
                            synonym: false,
                            children: [],
                        }
                        // Process the synonyms
                        if (item.acceptedTaxonStatuses) {
                            let synonymList = []

                            // Run through the list of taxonomic statuses
                            item.acceptedTaxonStatuses.forEach((synonym) => {

                                // Is it really a synonym?
                                if (synonym.taxonIDAccepted != synonym.taxonID) {

                                    // Found a synonym, add it to the list of synonyms
                                    const synonymItem: TaxonNode = {
                                        name: synonym.taxon.scientificName,
                                        taxonID: synonym.taxon.id,
                                        author: synonym.taxon.author,
                                        expanded: false,
                                        synonym: true,
                                        children: []
                                    }
                                    synonymList.push(synonymItem)
                                }

                            })

                            // Sort the list of synonyms
                            synonymList = synonymList.sort(function (a, b) {
                                return 0 - (a.name > b.name ? 1 : -1)
                            })

                            // Add the synonym list as children of the itemNode
                            itemNode.children = synonymList
                        }

                        return itemNode
                    })
                    .reduce<TaxonNode[]>((a , b: TaxonNode ) => {

                        // Add the child node in the tree to its parent up the tree
                        b.children.push(a[0])
                        return [b]
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
            this.taxaService.findByID(tid, this.taxonomicAuthorityID)
                .subscribe((taxonRec) => {

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
        //this.taxaService.findScientificName(node.name,
        //    this.taxonomicAuthorityID).subscribe((taxon) => {

            // The status table has the direct parent, so lookup its children there
            this.taxonomicStatusService.findChildren(node.taxonID,
                this.taxonomicAuthorityID).subscribe((taxonStatus) => {

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
        //})
    }

    /*
    Expand a node in the tree by finding its descendants
     */
    private fetchDescendants(node: TaxonNode) {

        let descTids  = []

        // Match the name to a taxon id
        this.taxaService.findScientificName(node.name, this.taxonomicAuthorityID).subscribe((taxon) => {

            // The enum table has the descendants so look them up there
            this.taxonomicEnumTreeService.findDescendants(taxon.id, this.taxonomicAuthorityID).subscribe((taxonET) => {

                // For each one found, add its list of taxon ids to the children list
                // TODO: should this be just one, due to taxa authority id?
                taxonET.forEach(function(rec) {
                    descTids = descTids.concat(rec.taxonID.toString())
                })

                // Check to see if there are any children
                if (descTids.length == 0) {
                    // There are no children (current node is a leaf node)
                    // Mark that current node should be expanded to show children
                    node.expanded = true

                    // Redraw the tree and exit
                    this.refreshTree()
                    return
                }

                // Need to build up a tree of descendants
                let descendants = []

                // Look up the names by their ids
                this.taxonomicStatusService
                    .findAll( {taxonIDs: descTids, taxonomicAuthorityID: this.taxonomicAuthorityID})
                    .subscribe((t) => {
                        descendants = t
                        let myMap = {}
                        let nodeMap = {}
                        nodeMap[node.taxonID] = node

                        // Need to build the descendant tree
                        // First build a map of parents to children
                        descendants.forEach((c) => {
                            const node : TaxonNode = {
                                name: c.taxon.scientificName,
                                taxonID: c.taxonID,
                                author: c.taxon.author,
                                expanded: true,
                                synonym: false,
                                children: [],
                            }
                            nodeMap[c.taxonID] = node
                            if (!myMap[c.parentTaxonID]) {
                                myMap[c.parentTaxonID] = []
                            }
                            myMap[c.parentTaxonID].push(c.taxonID)
                        })

                        // Next build tree
                        this.fillInDescendants(taxon.id, myMap, nodeMap)

                        /*
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


                         */
                        // Refresh the tree
                        this.refreshTree()

                    })
            })
        })
    }

    // Build up a tree of descendants nodes, one node at a time
    fillInDescendants(taxonid, descMap, nodeMap) {
        // Check that the node is a parent
        if (!descMap[taxonid]) {
            // I'm a leaf return my children
            return nodeMap[taxonid]
        }
        const node = nodeMap[taxonid]
        descMap[taxonid].forEach((child) => {
            const childNode = this.fillInDescendants(child, descMap, nodeMap)
            node.children.push(childNode)
            }
        )
        return node
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

}
