import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
    Q_PARAM_CAT_NUM,
    Q_PARAM_COLLIDS,
} from '../../../constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { ApiOccurrenceFindAllParams } from '@symbiota2/data-access';
import { ROUTE_SEARCH_RESULTS } from '../../routes';

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
    taxonSearchCriterion = new FormControl(this.taxonCriteriaOptions[0].value);
    taxonSearchStr = new FormControl('');
    country = new FormControl('');
    stateProvince = new FormControl('');
    county = new FormControl('');
    locality = new FormControl('');
    minimumElevationInMeters = new FormControl(null, [Validators.min(0)]);
    maximumElevationInMeters = new FormControl(null, [Validators.min(0)]);
    minLatitude = new FormControl(null);
    minLongitude = new FormControl(null);
    maxLatitude = new FormControl(null);
    maxLongitude = new FormControl(null);

    taxonCriteria = new FormGroup({
        taxonSearchCriterion: this.taxonSearchCriterion,
        taxonSearchStr: this.taxonSearchStr
    });

    localityCriteria = new FormGroup({
        country: this.country,
        stateProvince: this.stateProvince,
        county: this.county,
        locality: this.locality,
        minimumElevationInMeters: this.minimumElevationInMeters,
        maximumElevationInMeters: this.maximumElevationInMeters,
        minLatitude: this.minLatitude,
        minLongitude: this.minLongitude,
        maxLatitude: this.maxLatitude,
        maxLongitude: this.maxLongitude
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
        const taxonEntries = Object.entries(this.taxonCriteria.value).filter(([_, v]) => {
            return v !== null && v !== '';
        });
        const localityEntries = Object.entries(this.localityCriteria.value).filter(([_, v]) => {
            return v !== null && v !== '';
        });

        const taxonParams = taxonEntries.reduce((obj, [k, v]) => {
            obj[k] = v.toString();
            return obj;
        }, {});

        const localityParams = localityEntries.reduce((obj, [k, v]) => {
            obj[k] = v.toString();
            return obj;
        }, {});

        return this.router.navigate(
            [`/${ROUTE_SEARCH_RESULTS}`],
            {
                queryParams: {
                    'collectionID[]': this.collectionIDs.map((n) => n.toString()),
                    ...taxonParams,
                    ...localityParams
                }
            }
        );
    }
}
