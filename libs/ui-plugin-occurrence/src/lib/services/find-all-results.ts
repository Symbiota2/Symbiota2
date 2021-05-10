import {
    BehaviorSubject,
    Observable,
    PartialObserver,
    Subscription
} from 'rxjs';
import { OccurrenceListItem } from '../dto/occurrence-list-item';
import {
    ApiOccurrenceFindAllParams,
    ApiOccurrenceListItem
} from '@symbiota2/data-access';
import { Injectable } from '@angular/core';
import { ApiClientService, AppConfigService } from '@symbiota2/ui-common';
import { OccurrenceQueryBuilder } from './occurrence-query-builder';
import { catchError, map, tap } from 'rxjs/operators';

type FindAllParams = Omit<Partial<ApiOccurrenceFindAllParams>, "limit" | "offset">;

@Injectable()
export class FindAllResults {
    private _limit = 25;
    private _offset = 0;
    private _params: Partial<ApiOccurrenceFindAllParams> = {};
    private readonly _occurrences = new BehaviorSubject<OccurrenceListItem[]>([]);

    occurrences = this._occurrences.asObservable();

    constructor(
        private readonly appConfig: AppConfigService,
        private readonly api: ApiClientService) { }

    fetch(params: FindAllParams): void {
        this._params = params;
        this._updateOccurrences();
    }

    limit(limit: number): void {
        this._limit = limit;
    }

    nextPage() {
        this._offset += this._limit;
        this._updateOccurrences();
    }

    previousPage() {
        if (this._offset > 0) {
            this._offset -= this._limit;
            this._updateOccurrences();
        }
    }

    private _updateOccurrences() {
        let url = new OccurrenceQueryBuilder(this.appConfig.apiUri()).findAll()
            .queryParam('limit', this._limit)
            .queryParam('offset', this._offset);

        for (const key of Object.keys(this._params)) {
            url = url.queryParam(
                key as keyof ApiOccurrenceFindAllParams,
                this._params[key]
            );
        }

        const query = this.api.queryBuilder(url.build()).get().build();
        this.api.send<unknown, ApiOccurrenceListItem[]>(query)
            .pipe(
                catchError((e) => {
                    console.error(e);
                    return [];
                }),
                map((occurrences) => occurrences.map((o) => {
                    return OccurrenceListItem.fromJSON(o);
                }))
            ).subscribe((occurrences) => {
                this._occurrences.next(occurrences);
            });
    }
}
