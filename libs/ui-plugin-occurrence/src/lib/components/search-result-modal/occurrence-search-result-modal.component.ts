import {Component, Inject, OnInit} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { OccurrenceService } from '../../services/occurrence.service';
import { Collection, CollectionService } from '@symbiota2/ui-plugin-collection';
import { Occurrence, OccurrenceListItem } from '../../dto';
import { forkJoin, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: "occurrence-search-search-result-modal",
    templateUrl: "./occurrence-search-result-modal.component.html",
    styleUrls: ["./occurrence-search-result-modal.component.scss"]
})
export class OccurrenceSearchResultModalComponent implements OnInit {
    public collection: Collection;
    public occurrence: Occurrence;

    constructor(
        private readonly translate: TranslateService,
        private readonly occurrences: OccurrenceService,
        private readonly collections: CollectionService,
        @Inject(MAT_DIALOG_DATA) public occurrenceListItem: OccurrenceListItem,
        public dialogRef: MatDialogRef<OccurrenceSearchResultModalComponent>) { }

    ngOnInit() {
        forkJoin([
            this.occurrences.findByID(this.occurrenceListItem.id),
            this.collections.findByID(this.occurrenceListItem.collectionID)
        ]).subscribe(([occurrence, collection]) => {
            this.occurrence = occurrence;
            this.collection = collection;
        });
    }

    get loaded(): boolean {
        return !!this.occurrence && !!this.collection;
    }

    onEditClick() {
        // console.log(this.authService.getCurrentPermissions());
    }

    onCloseClick() {
        this.dialogRef.close();
    }

    getI18nForField(occurrenceField: string): Observable<string> {
        return this.translate.get(`plugins.occurrence.fields.${occurrenceField}`);
    }
}
