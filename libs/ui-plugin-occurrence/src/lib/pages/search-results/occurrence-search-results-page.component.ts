import {Component, OnInit} from "@angular/core";
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { Q_PARAM_COLLIDS } from '../../../constants';
import { LoadingService } from '@symbiota2/ui-common';
import { OccurrenceService } from '../../services/occurrence.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: "occurrence-search-search-results",
    templateUrl: "./occurrence-search-results-page.component.html",
    styleUrls: ["./occurrence-search-results-page.component.scss"]
})
export class OccurrenceSearchResultsPage implements OnInit {
    public totalResults = 0;
    public itemsPerPage = 50;
    public occurrences = [];

    private collectionIDs: number[] = [];
    private catalogNumber = "";
    private taxonSearchType = "";
    private taxonSearchStr = "";
    private locality = "";
    private province = "";
    private country = "";
    private collector = "";
    private collectionDateStart: Date = null;
    private collectionDateEnd: Date = null;

    constructor(
        private readonly router: Router,
        private readonly currentRoute: ActivatedRoute,
        private readonly loading: LoadingService,
        private readonly occurrenceService: OccurrenceService) { }

    get queryParams(): ParamMap {
        return this.currentRoute.snapshot.queryParamMap;
    }

    ngOnInit() {
        this.collectionIDs = this.queryParams.getAll(Q_PARAM_COLLIDS).map((collid) => {
            return parseInt(collid);
        });

        if (this.collectionIDs.length > 0) {

            this.loadOccurrences();
        }
        else {
            this.prevPage();
        }
    }

    loadOccurrences() {
        const findParams = {
            collectionIDs: this.collectionIDs,
            catalogNumber: this.catalogNumber
        };

        this.occurrenceService.findAll(findParams).subscribe((occurrences) => {
            this.occurrences = occurrences;
        });
    }

    onItemsPerPageChanged(itemsPerPage: string) {
        // this.itemsPerPage = parseInt(itemsPerPage);
        this.loadOccurrences();
    }

    getFirstIndexOnPage() {
        if (this.totalResults === 0) {
            return 0;
        }
        // return this.itemsPerPage * (this.currentPage - 1) + 1;
    }

    getLastIndexOnPage(): number {
        // const lastIdx = this.getFirstIndexOnPage() + this.itemsPerPage - 1;
        // if (lastIdx > this.totalResults) {
        //     return this.totalResults;
        // }
        // return lastIdx;
        return 1;
    }

    async prevPage() {
        this.router.navigate(
            ['..'],
            {
                relativeTo: this.currentRoute,
                queryParams: this.currentRoute.snapshot.queryParams
            }
        );
    }
}
