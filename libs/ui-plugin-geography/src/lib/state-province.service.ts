import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Country, CountryListItem } from './dto/country';
import { ApiClientService } from '@symbiota2/ui-common';
import { GeographyQueryBuilder } from './query-builder';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class StateProvinceService {
    private _provinces = new BehaviorSubject<CountryListItem[]>([]);
    provinceList = this._provinces.asObservable();

    constructor(
        private readonly api: ApiClientService,
        private readonly queryBuilder: GeographyQueryBuilder) {

        this.refreshList();
    }

    refreshList(): void {
        const url = this.queryBuilder.provinces().findAll().build();
        const query = this.api.queryBuilder(url).get().build();
        this.api.send<unknown, Record<string, unknown>[]>(query).pipe(
            catchError((e) => {
                console.error(e);
                return of([] as Record<string, unknown>[]);
            }),
            map((provinces) => {
                const provinceObjs = provinces.map((country) => new Country(country));
                this._provinces.next(provinceObjs);
            })
        ).subscribe();
    }
}
