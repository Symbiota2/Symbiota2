import {
    BehaviorSubject, combineLatest, ReplaySubject
} from 'rxjs';
import {
    ApiOccurrenceFindAllParams, ApiOccurrenceList,
} from '@symbiota2/data-access';
import { Injectable } from '@angular/core';
import { ApiClientService, AppConfigService } from '@symbiota2/ui-common';
import { OccurrenceQueryBuilder } from './occurrence-query-builder';
import { catchError, map } from 'rxjs/operators';
import { OccurrenceList } from '../dto/occurrence-list';

type FindAllParams = Partial<Omit<ApiOccurrenceFindAllParams, "limit" | "offset">>;
interface PageParams {
    limit: number;
    offset: number;
}

@Injectable()
export class OccurrenceSearchResults {
    private readonly _params = new ReplaySubject<FindAllParams>(1);
    private readonly _page = new BehaviorSubject<PageParams>({ limit: 25, offset: 0 });

    private readonly _occurrences = new BehaviorSubject<OccurrenceList>(
        new OccurrenceList({ count: 0, data: [] })
    );

    occurrences = this._occurrences.asObservable();

    constructor(
        private readonly appConfig: AppConfigService,
        private readonly api: ApiClientService) {

        combineLatest([this._params, this._page]).subscribe(([params, page]) => {
            this._updateOccurrences(params, page);
        });
    }

    setQueryParams(params: FindAllParams): void {
        this._params.next(params);
    }

    changePage(limit: number, offset: number): void {
        this._page.next({ limit, offset });
    }

    clear(): void {
        this._occurrences.next(new OccurrenceList({ count: 0, data: [] }));
    }

    private _updateOccurrences(params: FindAllParams, page: PageParams) {
        let url = new OccurrenceQueryBuilder(this.appConfig.apiUri()).findAll()
            .collectionIDs(params.collectionID)
            .queryParam('limit', page.limit)
            .queryParam('offset', page.offset);

        for (const key of Object.keys(params)) {
            if (key !== 'collectionID') {
                url = url.queryParam(key as any, params[key]);
            }
        }

        const query = this.api.queryBuilder(url.build()).get().build();
        this.api.send<unknown, ApiOccurrenceList>(query)
            .pipe(
                catchError((e) => {
                    console.error(e);
                    return [];
                }),
                map((occurrences) => new OccurrenceList(occurrences))
            ).subscribe((occurrences) => {
                this._occurrences.next(occurrences);
            });
    }
}
