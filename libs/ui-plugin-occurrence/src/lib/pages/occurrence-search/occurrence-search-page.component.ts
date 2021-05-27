import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Q_PARAM_COLLID } from '../../../constants';
import { Validators } from '@angular/forms';
import { ROUTE_SEARCH_RESULTS } from '../../routes';
import {
    formToQueryParams,
    TypedFormControl,
    TypedFormGroup
} from '@symbiota2/ui-common';
import {
    ApiOccurrenceFindAllParams,
    ApiTaxonSearchCriterion
} from '@symbiota2/data-access';
import { CountryService } from '@symbiota2/ui-plugin-geography';
import { combineAll, filter, map, startWith } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

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

    collectionIDs = new TypedFormControl<number[]>([]);

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
    limitToGenetic = new TypedFormControl<boolean>(null);

    form = new TypedFormGroup<Omit<ApiOccurrenceFindAllParams, 'limit' | 'offset'>>({
        [Q_PARAM_COLLID]: this.collectionIDs,
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
        limitToGenetic: this.limitToGenetic
    });

    // TODO: Should we filter on API side instead?
    countrySearchFilter = this.country.valueChanges.pipe(
        map(() => this.country.value),
        startWith('')
    );
    countryAutoComplete = combineLatest([
        this.countries.countryList,
        this.countrySearchFilter
    ]).pipe(
        map(([countries, searchFilter]) => {
            return countries.filter(
                (country) => country.countryTerm.startsWith(searchFilter)
            );
        })
    );

    constructor(
        private router: Router,
        private currentRoute: ActivatedRoute,
        private readonly countries: CountryService) { }

    ngOnInit() {
        const currentParams = this.currentRoute.snapshot.queryParamMap;

        if (currentParams.has(Q_PARAM_COLLID)) {
            this.collectionIDs.setValue(
                currentParams.getAll(Q_PARAM_COLLID).map(
                    (collID) => parseInt(collID)
                )
            );
        }
    }

    get searchDisabled(): boolean {
        return this.collectionIDs.value.length === 0;
    }

    async onSearch() {
        const queryParams = formToQueryParams(this.form);
        return this.router.navigate(
            [`/${ROUTE_SEARCH_RESULTS}`],
            { queryParams: { ...queryParams } }
        );
    }
}
