import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';

@Component({
    selector: "taxa-search-search-collections",
    templateUrl: "./taxa-search-page.component.html",
    styleUrls: ["./taxa-search-page.component.scss"],
})
export class TaxaSearchPage implements OnInit {
    public readonly PAGE_COLLECTION_SELECT = 0;
    public readonly PAGE_SEARCH_CRITERIA = 1;
    public readonly PAGE_SEARCH_RESULTS = 2;

    public collectionIDs: number[] = [];
    public currentPage = this.PAGE_COLLECTION_SELECT;

    constructor(
        private router: Router,
        private currentRoute: ActivatedRoute) { }

    ngOnInit() {
        this.currentRoute.queryParamMap.subscribe((params) => {
            if (params.has('collectionID[]')) {
                this.collectionIDs = params.getAll('collectionID[]').map(parseInt);
            }
            if (params.has('page')) {
                const page = parseInt(params.get('page'));

                if (!Number.isNaN(page)) {
                    const inRange = (
                        page >= this.PAGE_SEARCH_CRITERIA &&
                        page <= this.PAGE_SEARCH_RESULTS
                    );

                    if (inRange) {
                        this.currentPage = page;
                    }
                }
            }
        });
    }

    onCollectionIDsChanged(collectionIDs: number[]) {
        this.collectionIDs = collectionIDs;
    }

    async onSwitchPage(page: number) {
        const collIDs = (
            this.collectionIDs.length > 0 ? this.collectionIDs : null
        );

        await this.router.navigate(
            [],
            {
                relativeTo: this.currentRoute,
                queryParams: {
                    'collectionID[]': collIDs,
                    'page': page
                }
            }
        );
    }

    async onPrevious() {
        return this.onSwitchPage(this.currentPage - 1);
    }

    async onNext() {
        return this.onSwitchPage(this.currentPage + 1);
    }
}
