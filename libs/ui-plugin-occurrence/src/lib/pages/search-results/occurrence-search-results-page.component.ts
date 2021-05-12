import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LoadingService } from '@symbiota2/ui-common';
import { OccurrenceService } from '../../services/occurrence.service';
import {
    ApiOccurrenceFindAllParams,
    ApiOccurrenceListItem, ApiTaxonSearchCriterion
} from '@symbiota2/data-access';
import { Observable } from 'rxjs';
import { MatTable } from '@angular/material/table';
import { tap } from 'rxjs/operators';
import { OccurrenceList } from '../../dto/occurrence-list';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { OccurrenceListItem } from '../../dto';
import { OccurrenceSearchResultModalComponent } from '../../components';
import { ROUTE_COLLECTION_PROFILE } from '@symbiota2/ui-plugin-collection';

@Component({
    selector: "symbiota2-occurrence-search-results",
    templateUrl: "./occurrence-search-results-page.component.html",
    styleUrls: ["./occurrence-search-results-page.component.scss"]
})
export class OccurrenceSearchResultsPage implements OnInit {
    @ViewChild(MatTable) table: MatTable<ApiOccurrenceListItem>;

    public limit = 25;
    public offset = 0;

    readonly SHOW_COLUMNS = [
        'occurrenceID',
        'collection',
        'catalogNumber',
        'sciName',
        'latitude',
        'longitude'
    ];
    occurrences: Observable<OccurrenceList>;

    constructor(
        private readonly router: Router,
        private readonly currentRoute: ActivatedRoute,
        private readonly loading: LoadingService,
        private readonly matDialog: MatDialog,
        private readonly occurrenceService: OccurrenceService) { }

    get queryParams(): ParamMap {
        return this.currentRoute.snapshot.queryParamMap;
    }

    ngOnInit() {

        // TODO: Clean this up
        const collectionIDs = this.queryParams.getAll('collectionID[]').map(
            (id) => parseInt(id)
        );
        const taxonSearchCriterion = this.queryParams.get('taxonSearchCriterion');
        const taxonSearchStr = this.queryParams.get('taxonSearchStr');
        const country = this.queryParams.get('country');
        const stateProvince = this.queryParams.get('stateProvince');
        const county = this.queryParams.get('county');
        const locality = this.queryParams.get('locality');
        const minimumElevationInMeters = parseInt(this.queryParams.get('minimumElevationInMeters'));
        const maximumElevationInMeters = parseInt(this.queryParams.get('maximumElevationInMeters'));

        const minLatitude = parseInt(this.queryParams.get('minLatitude'));
        const minLongitude = parseInt(this.queryParams.get('minLongitude'));

        const maxLatitude = parseInt(this.queryParams.get('maxLatitude'));
        const maxLongitude = parseInt(this.queryParams.get('maxLongitude'));

        const collectorLastName = this.queryParams.get('collectorLastName');

        const minEventDateStr = this.queryParams.get('minEventDate');
        const maxEventDateStr = this.queryParams.get('maxEventDate');

        const minEventDate = minEventDateStr ? new Date(minEventDateStr) : null;
        const maxEventDate = maxEventDateStr ? new Date(maxEventDateStr) : null;

        const catalogNumber = this.queryParams.get('catalogNumber');

        const limitToSpecimensStr = this.queryParams.get('limitToSpecimens');
        const limitToImagesStr = this.queryParams.get('limitToImages');
        const limitToGeneticStr = this.queryParams.get('limitToGenetic');

        const limitToSpecimens = limitToSpecimensStr ? limitToSpecimensStr === 'true' : null;
        const limitToImages = limitToImagesStr ? limitToImagesStr === 'true' : null;
        const limitToGenetic = limitToGeneticStr ? limitToGeneticStr === 'true' : null;

        if (collectionIDs.length > 0) {
            const findParams: ApiOccurrenceFindAllParams = {
                collectionID: collectionIDs,
                taxonSearchCriterion: taxonSearchStr ? taxonSearchCriterion as ApiTaxonSearchCriterion : null,
                taxonSearchStr,
                county,
                country,
                stateProvince,
                locality,
                minimumElevationInMeters,
                maximumElevationInMeters,
                minLatitude,
                minLongitude,
                maxLatitude,
                maxLongitude,
                catalogNumber,
                collectorLastName,
                limitToSpecimens,
                limitToImages,
                limitToGenetic,
                minEventDate: minEventDate ? minEventDate.toISOString() : null,
                maxEventDate: maxEventDate ? maxEventDate.toISOString() : null,
                limit: this.limit,
                offset: this.offset
            };

            this.occurrences = this.occurrenceService.searchResults.occurrences.pipe(
                    tap(() => {
                        if (this.table) {
                            this.table.renderRows();
                        }
                    })
                );

            // Initial fetch, remaining are updated when searchResults.page()
            // is called
            this.occurrenceService.searchResults.fetch(findParams);
        }
        else {
            this.router.navigate(
                ['..'],
                {
                    relativeTo: this.currentRoute,
                    queryParams: this.currentRoute.snapshot.queryParams
                }
            );
        }
    }

    collectionURL(id: number): string {
        return `/${ROUTE_COLLECTION_PROFILE.replace(':collectionID', id.toString())}`;
    }

    onPageChanged(e: PageEvent) {
        const limit = e.pageSize;
        const offset = limit * e.pageIndex;
        this.occurrenceService.searchResults.page(limit, offset);
    }

    onOccurrenceSelected(occurrence: OccurrenceListItem) {
        this.matDialog.open(
            OccurrenceSearchResultModalComponent,
            {
                panelClass: 'mat-dialog-panel',
                data: occurrence
            }
        );
    }
}
