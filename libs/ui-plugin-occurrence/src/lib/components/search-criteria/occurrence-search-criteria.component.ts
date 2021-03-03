import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
    selector: "occurrence-search-search-criteria",
    templateUrl: "./occurrence-search-criteria.component.html",
    styleUrls: ["./occurrence-search-criteria.component.scss"],
})
export class OccurrenceSearchCriteria {
    private static readonly TAXON_SCI_NAME = 'scientificName';

    readonly TaxonSearchOpts = [
        {
            name: 'Scientific Name',
            value: OccurrenceSearchCriteria.TAXON_SCI_NAME
        }
    ];

    @Input()
    public catalogNumber: string = null;

    @Output()
    public catalogNumberChange = new EventEmitter<string>();

    @Input()
    public taxonSearchType: string = null;

    @Input()
    public taxonSearchStr: string = null;

    @Input()
    public locality: string = null;

    @Input()
    public province: string = null;

    @Input()
    public country: string = null;

    @Input()
    public collector: string = null;

    @Input()
    public collectionDateStart: Date = null;

    @Input()
    public collectionDateEnd: Date = null;
}
