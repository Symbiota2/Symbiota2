import { Component, Inject, Optional } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { TaxonInfo } from '../taxon-taxon-editor/taxon-taxon-editor.component';
import { FormControl, Validators } from '@angular/forms';
import { TaxonomicUnitService } from '../../services';

@Component({
    selector: 'taxon-taxon-dialog-box',
    templateUrl: './taxon-taxon-dialog.component.html',
    styleUrls: ['./taxon-taxon-dialog.component.scss']
})
export class TaxonTaxonDialogComponent {

    public action : string
    public local_data : any
    public rankNamesMap = new Map()
    public rankNames = []
    public rankID
    public element
    sortSequence
    constructor(
        public dialogRef: MatDialogRef<TaxonTaxonDialogComponent>,
        private readonly taxonomicUnitService: TaxonomicUnitService,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: TaxonInfo) {
        this.local_data = {...data}
        this.action = this.local_data.action
        this.sortSequence =
            new FormControl(
                this.local_data.phyloSortSequence,
                [Validators.pattern("[0-9]+")]
            )
    }

    ngOnInit() {
        this.rankNamesMap = new Map()
        this.taxonomicUnitService.findAll().subscribe((ranks) => {
            ranks.forEach((rank) => {
                if (rank.kingdomName == this.local_data.kingdomName) {
                    this.rankNamesMap.set(rank.rankID, {name: rank.rankName, id: rank.rankID})
                }
                if (rank.rankID = this.local_data.rankID) {
                    this.rankID = rank.rankID
                }
            })
            const keys =[ ...this.rankNamesMap.keys() ].sort((a,b) => a-b)
            keys.forEach((key) => {
                this.rankNames.push(this.rankNamesMap.get(key))
            })
        })

    }

    doAction(){
        this.local_data.phyloSortSequence = this.sortSequence
        this.local_data.rankID = this.rankID
        this.dialogRef.close({event:this.action,data:this.local_data})
    }

    closeDialog(){
        this.dialogRef.close({event:'Cancel'})
    }

}
