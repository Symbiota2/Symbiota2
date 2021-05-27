import { Injectable } from '@angular/core';
import { GeographyQueryBuilder } from './query-builder';
import { Country, CountryListItem } from './dto/country';
import { ApiClientService } from '@symbiota2/ui-common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CountryService {
    private _countries = new BehaviorSubject<CountryListItem[]>([]);
    countries = this._countries.asObservable();

    constructor(
        private readonly api: ApiClientService,
        private readonly queryBuilder: GeographyQueryBuilder) {

        this.refreshList();
    }

    refreshList() {
        const url = this.queryBuilder.countries().findAll().build();
        const query = this.api.queryBuilder(url).get().build();
        return this.api.send<unknown, Record<string, unknown>[]>(query).pipe(
            catchError((e) => {
                console.error(e);
                return of([] as Record<string, unknown>[]);
            }),
            map((countries) => {
                const countryObjs = countries.map((country) => new Country(country));
                this._countries.next(countryObjs);
            })
        );
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
