import { Injectable } from '@angular/core';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { ApiClientService } from '@symbiota2/ui-common';
import { GeographyQueryBuilder } from './query-builder';
import { catchError, map } from 'rxjs/operators';
import { ProvinceListItem } from './dto/province';
import {
    ApiStateProvinceListItemOutput,
    ApiStateProvinceQueryInput
} from '@symbiota2/data-access';

@Injectable()
export class StateProvinceService {
    private _provinces = new BehaviorSubject<ProvinceListItem[]>([]);
    private queryParams = new ReplaySubject<ApiStateProvinceQueryInput>(1);

    provinceList = this._provinces.asObservable();

    constructor(
        private readonly api: ApiClientService,
        private readonly queryBuilder: GeographyQueryBuilder) {

        this.queryParams.subscribe((params) => {
            this.refreshList(params);
        });
    }

    setQueryParams(params: ApiStateProvinceQueryInput) {
        this.queryParams.next(params);
    }

    private refreshList(params: ApiStateProvinceQueryInput): void {
        const url = this.queryBuilder.provinces().findAll(params).build();
        const query = this.api.queryBuilder(url).get().build();

        this.api.send<unknown, ApiStateProvinceListItemOutput[]>(query).pipe(
            catchError((e) => {
                console.error(e);
                return of([] as ApiStateProvinceListItemOutput[]);
            }),
            map((provinces) => {
                const provinceObjs = provinces.map((province) => new ProvinceListItem(province));
                this._provinces.next(provinceObjs);
            })
        ).subscribe();
    }
}
