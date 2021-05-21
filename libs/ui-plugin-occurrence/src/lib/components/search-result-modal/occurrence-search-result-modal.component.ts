import {Component, Inject, OnInit} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { OccurrenceService } from '../../services/occurrence.service';
import {
    CollectionListItem
} from '@symbiota2/ui-plugin-collection';
import { Occurrence, OccurrenceListItem } from '../../dto';
import { combineLatest, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@symbiota2/ui-common';
import { filter, map, startWith, take } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: "symbiota2-occurrence-search-result-modal",
    templateUrl: "./occurrence-search-result-modal.component.html",
    styleUrls: ["./occurrence-search-result-modal.component.scss"]
})
export class OccurrenceSearchResultModalComponent implements OnInit {
    collection$: Observable<CollectionListItem>;
    occurrence$: Observable<Occurrence>;

    isEditing = false;
    canEdit: Observable<boolean>;

    constructor(
        private readonly translate: TranslateService,
        private readonly occurrences: OccurrenceService,
        private readonly userService: UserService,
        private readonly router: Router,
        @Inject(MAT_DIALOG_DATA) public occurrenceListItem: OccurrenceListItem,
        public dialogRef: MatDialogRef<OccurrenceSearchResultModalComponent>) { }

    ngOnInit() {
        this.occurrence$ = this.occurrences.findByID(this.occurrenceListItem.id);
        this.collection$ = this.occurrence$.pipe(
            map((occurrence) => {
                if (occurrence) {
                    return occurrence.collection;
                }
                return null;
            })
        );

        this.canEdit = combineLatest([
            this.userService.currentUser,
            this.occurrence$
        ]).pipe(
            map(([user, occurrence]) => {
                return (
                    user !== null &&
                    user.canEditCollection(occurrence.collection.id)
                );
            }),
            startWith(false)
        );

        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            take(1)
        ).subscribe(() => {
            this.dialogRef.close();
        });
    }

    isDate(val: string | number | Date): boolean {
        return val instanceof Date;
    }

    isNumber(val: string | number): boolean {
        return typeof val === 'number';
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
