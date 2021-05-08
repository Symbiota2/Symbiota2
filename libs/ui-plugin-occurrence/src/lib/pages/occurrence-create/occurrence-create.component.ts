import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { AlertService } from '@symbiota2/ui-common';
import { CollectionService } from '@symbiota2/ui-plugin-collection';
import { OccurrenceService } from '../../services/occurrence.service';
import { ApiOccurrence } from '@symbiota2/data-access';

@Component({
    selector: 'symbiota2-occurrence-create',
    templateUrl: './occurrence-create.component.html',
    styleUrls: ['./occurrence-create.component.scss']
})
export class OccurrenceCreateComponent {
    private collectionID = this.currentRoute.queryParamMap.pipe(
        map((queryParams) => {
            if (queryParams.has('collectionID')) {
                return parseInt(queryParams.get('collectionID'))
            }
            return -1;
        })
    );

    private collection = this.collectionID.pipe(
        switchMap((collectionID) => {
            return this.collections.findByID(collectionID)
        }),
        tap((collection) => {
            if (collection === null) {
                this.alerts.showError('Collection not found');
                this.router.navigate(
                    ['/viewprofile'],
                    { queryParams: { tab: 3 } }
                );
            }
        }),
        filter((collection) => collection !== null)
    );

    collectionName = this.collection.pipe(
        map((collection) => collection.collectionName)
    );

    collectionLogo = this.collection.pipe(
        map((collection) => collection.icon)
    );

    private formData: Partial<ApiOccurrence> = null;

    constructor(
        private readonly currentRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly alerts: AlertService,
        private readonly collections: CollectionService,
        private readonly occurrences: OccurrenceService) { }

    onFormChanged(formData: Partial<ApiOccurrence>): void {
        this.formData = formData;
    }

    onSubmit() {
        this.collectionID.pipe(
            take(1),
            switchMap((collectionID) => {
                return this.occurrences.create(collectionID, this.formData)
            }),
            tap((occurrence) => {
                if (occurrence === null) {
                    this.alerts.showError('Error creating occurrence');
                }
                else {
                    this.alerts.showMessage('Occurrence created successfully');
                    // TODO: Redirect to occurrence page
                }
            })
        ).subscribe((newOccurrence) => {
            console.log(newOccurrence);
        })
    }
}
