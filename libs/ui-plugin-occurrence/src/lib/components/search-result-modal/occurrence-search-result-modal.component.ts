import {Component, Inject, OnInit} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { OccurrenceService } from '../../services/occurrence.service';
import { Collection, CollectionService } from '@symbiota2/ui-plugin-collection';
import { Occurrence, OccurrenceListItem } from '../../dto';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@symbiota2/ui-common';
import { map } from 'rxjs/operators';

@Component({
    selector: "symbiota2-occurrence-search-result-modal",
    templateUrl: "./occurrence-search-result-modal.component.html",
    styleUrls: ["./occurrence-search-result-modal.component.scss"]
})
export class OccurrenceSearchResultModalComponent implements OnInit {
    collection$: Observable<Collection>;
    occurrence$: Observable<Occurrence>;

    isEditing = false;
    canEdit: Observable<boolean>;

    constructor(
        private readonly translate: TranslateService,
        private readonly occurrences: OccurrenceService,
        private readonly collections: CollectionService,
        private readonly userService: UserService,
        @Inject(MAT_DIALOG_DATA) public occurrenceListItem: OccurrenceListItem,
        public dialogRef: MatDialogRef<OccurrenceSearchResultModalComponent>) { }

    ngOnInit() {
        this.canEdit = this.userService.currentUser.pipe(
            map((user) => user.canEditCollection(this.occurrenceListItem.collectionID))
        );

        this.occurrence$ = this.occurrences.findByID(this.occurrenceListItem.id);
        this.collection$ = this.collections.findByID(this.occurrenceListItem.collectionID);
    }

    onEditClick() {
        this.isEditing = !this.isEditing;
    }

    onCloseClick() {
        this.dialogRef.close();
    }

    getI18nForField(occurrenceField: string): Observable<string> {
        return this.translate.get(`plugins.occurrence.fields.${occurrenceField}`);
    }
}
