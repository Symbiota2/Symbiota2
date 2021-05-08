import {Component, OnInit} from "@angular/core";
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { LoadingService } from '@symbiota2/ui-common';
import { OccurrenceService } from '../../services/occurrence.service';
import {
    ApiOccurrenceFindAllParams,
    ApiOccurrenceListItem, ApiTaxonSearchCriterion
} from '@symbiota2/data-access';
import { Observable } from 'rxjs';

@Component({
    selector: "symbiota2-occurrence-search-results",
    templateUrl: "./occurrence-search-results-page.component.html",
    styleUrls: ["./occurrence-search-results-page.component.scss"]
})
export class OccurrenceSearchResultsPage implements OnInit {
    public limit = 25;
    public offset = 0;

    occurrences: Observable<ApiOccurrenceListItem[]>;

    constructor(
        private readonly router: Router,
        private readonly currentRoute: ActivatedRoute,
        private readonly loading: LoadingService,
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

        if (collectionIDs.length > 0) {
            const findParams: Partial<ApiOccurrenceFindAllParams> = {
                collectionID: collectionIDs,
                taxonSearchCriterion: taxonSearchCriterion as ApiTaxonSearchCriterion,
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
                limit: this.limit,
                offset: this.offset
            };

            this.occurrences = this.occurrenceService.findAll(findParams);
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
}
