import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Q_PARAM_COLLIDS } from '../../../constants';
import { Validators } from '@angular/forms';
import { ROUTE_SEARCH_RESULTS } from '../../routes';
import { TypedFormControl, TypedFormGroup } from '@symbiota2/ui-common';
import {
    ApiOccurrenceFindAllParams,
    ApiTaxonSearchCriterion
} from '@symbiota2/data-access';

@Component({
    selector: "symbiota2-occurrence-search-page",
    templateUrl: "./occurrence-search-page.component.html",
    styleUrls: ["./occurrence-search-page.component.scss"],
})
export class OccurrenceSearchCollectionsPage implements OnInit {
    readonly taxonCriteriaOptions = [
        { i18n: 'plugins.occurrence.search.taxonCriteria.familyOrSciName', value: 'familyOrSciName' },
        { i18n: 'plugins.occurrence.search.taxonCriteria.family', value: 'family' },
        { i18n: 'plugins.occurrence.search.taxonCriteria.sciName', value: 'sciName' },
        { i18n: 'plugins.occurrence.search.taxonCriteria.higherTaxon', value: 'higherTaxon' },
        { i18n: 'plugins.occurrence.search.taxonCriteria.commonName', value: 'commonName' },
    ];

    collectionIDs: number[] = [];

    // Taxon Criteria
    taxonSearchCriterion = new TypedFormControl<ApiTaxonSearchCriterion>(
        this.taxonCriteriaOptions[0].value as ApiTaxonSearchCriterion
    );
    taxonSearchStr = new TypedFormControl<string>('');

    // Locality criteria
    country = new TypedFormControl<string>('');
    stateProvince = new TypedFormControl<string>('');
    county = new TypedFormControl<number>(null);
    locality = new TypedFormControl<string>('');
    minimumElevationInMeters = new TypedFormControl<number>(null, [Validators.min(0)]);
    maximumElevationInMeters = new TypedFormControl<number>(null, [Validators.min(0)]);
    minLatitude = new TypedFormControl<number>(null);
    minLongitude = new TypedFormControl<number>(null);
    maxLatitude = new TypedFormControl<number>(null);
    maxLongitude = new TypedFormControl<number>(null);

    // Collector criteria
    collectorLastName = new TypedFormControl<string>('');
    minEventDate = new TypedFormControl<Date>(null);
    maxEventDate = new TypedFormControl<Date>(null);

    catalogNumber = new TypedFormControl<string>('');

    // Filters
    limitToSpecimens = new TypedFormControl<boolean>(null);
    limitToImages = new TypedFormControl<boolean>(null);
    limitToGeneric = new TypedFormControl<boolean>(null);

    form = new TypedFormGroup<Omit<ApiOccurrenceFindAllParams, 'collectionID' | 'limit' | 'offset'>>({
        taxonSearchCriterion: this.taxonSearchCriterion,
        taxonSearchStr: this.taxonSearchStr,
        country: this.country,
        stateProvince: this.stateProvince,
        county: this.county,
        locality: this.locality,
        minimumElevationInMeters: this.minimumElevationInMeters,
        maximumElevationInMeters: this.maximumElevationInMeters,
        minLatitude: this.minLatitude,
        minLongitude: this.minLongitude,
        maxLatitude: this.maxLatitude,
        maxLongitude: this.maxLongitude,
        collectorLastName: this.collectorLastName,
        minEventDate: this.minEventDate,
        maxEventDate: this.maxEventDate,
        catalogNumber: this.catalogNumber,
        limitToImages: this.limitToImages,
        limitToSpecimens: this.limitToSpecimens,
        limitToGenetic: this.limitToGeneric
    });

    constructor(
        private router: Router,
        private currentRoute: ActivatedRoute) { }

    ngOnInit() {
        const currentParams = this.currentRoute.snapshot.queryParamMap;

        if (currentParams.has(Q_PARAM_COLLIDS)) {
            this.collectionIDs = currentParams.getAll(Q_PARAM_COLLIDS).map(parseInt);
        }
    }

    get searchDisabled(): boolean {
        return this.collectionIDs.length === 0;
    }

    async onSearch() {
        return this.router.navigate(
            [`/${ROUTE_SEARCH_RESULTS}`],
            {
                queryParams: {
                    'collectionID[]': this.collectionIDs.map((n) => n.toString()),
                    ...this.form.value
                }
            }
        );
    }
}
