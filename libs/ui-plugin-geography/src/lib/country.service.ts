import { Injectable } from '@angular/core';
import { CountryQueryParams, GeographyQueryBuilder } from './query-builder';
import { Country, CountryListItem } from './dto/country';
import { ApiClientService } from '@symbiota2/ui-common';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class CountryService {
    private _countries = new BehaviorSubject<CountryListItem[]>([]);
    private queryParams = new BehaviorSubject<CountryQueryParams>({});

    countryList = this._countries.asObservable();

    constructor(
        private readonly api: ApiClientService,
        private readonly queryBuilder: GeographyQueryBuilder) {

        this.queryParams.subscribe((params) => {
            this.refreshList(params);
        });
    }

    setQueryParams(params: CountryQueryParams) {
        this.queryParams.next(params);
    }

    private refreshList(params: CountryQueryParams): void {
        const url = this.queryBuilder.countries().findAll(params).build();
        const query = this.api.queryBuilder(url).get().build();

        this.api.send<unknown, Record<string, unknown>[]>(query, { skipLoading: true }).pipe(
            catchError((e) => {
                console.error(e);
                return of([] as Record<string, unknown>[]);
            }),
            map((countries) => {
                const countryObjs = countries.map((country) => new Country(country));
                this._countries.next(countryObjs);
            })
        ).subscribe();
    }

    findByID(id: number): Observable<Country> {
        const url = this.queryBuilder.countries().findOne(id).build();
        const query = this.api.queryBuilder(url).get().build();
        return this.api.send<unknown, Record<string, unknown>>(query).pipe(
            catchError((e) => {
                console.error(e);
                return of(null);
            }),
            map((country) => {
                return new Country(country);
            })
        );
    }
}
