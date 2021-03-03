import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
    Q_PARAM_CAT_NUM,
    Q_PARAM_COLLIDS,
} from '../../../constants';

@Component({
    selector: "occurrence-search-page",
    templateUrl: "./occurrence-search-page.component.html",
    styleUrls: ["./occurrence-search-page.component.scss"],
})
export class OccurrenceSearchCollectionsPage implements OnInit {
    public collectionIDs: number[] = [];
    public catalogNumber: string = null;

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

    onSearch() {
        this.router.navigate(
            ['./results'],
            {
                relativeTo: this.currentRoute,
                queryParams: {
                    [Q_PARAM_COLLIDS]: this.collectionIDs,
                    [Q_PARAM_CAT_NUM]: this.catalogNumber
                }
            }
        );
    }
}
