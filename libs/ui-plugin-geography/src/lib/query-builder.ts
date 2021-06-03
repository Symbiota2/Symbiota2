import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { ApiStateProvinceQueryInput } from '@symbiota2/data-access';

@Injectable()
export class GeographyQueryBuilder {
    protected apiUrl: string;
    protected request: HttpRequest<any>;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    continents(): ContinentQueryBuilder {
        return new ContinentQueryBuilder(this.apiUrl);
    }

    countries(): CountryQueryBuilder {
        return new CountryQueryBuilder(this.apiUrl);
    }

    provinces(): ProvinceQueryBuilder {
        return new ProvinceQueryBuilder(this.apiUrl);
    }
}

export class ContinentQueryBuilder extends GeographyQueryBuilder {
    protected continentID: number = null;

    constructor(apiUrl: string) {
        super(apiUrl);
        this.apiUrl = `${this.apiUrl}/continents`;
    }

    findOne(id: number) {
        this.continentID = id;
        return this;
    }

    findAll() {
        return this;
    }

    build() {
        let url = this.apiUrl;
        if (this.continentID) {
            url = `${url}/${this.continentID}`;
        }
        return url;
    }
}

export class CountryQueryBuilder extends GeographyQueryBuilder {
    protected countryID: number = null;

    constructor(apiUrl: string) {
        super(apiUrl);
        this.apiUrl = `${this.apiUrl}/countries`;
    }

    findOne(id: number) {
        this.countryID = id;
        return this;
    }

    findAll() {
        return this;
    }

    build() {
        let url = this.apiUrl;
        if (this.countryID) {
            url = `${url}/${this.countryID}`;
        }
        return url;
    }
}

export class ProvinceQueryBuilder extends GeographyQueryBuilder {
    protected provinceID: number = null;
    protected queryParams: ApiStateProvinceQueryInput = null;

    constructor(apiUrl: string) {
        super(apiUrl);
        this.apiUrl = `${this.apiUrl}/provinces`;
    }

    findOne(id: number) {
        this.provinceID = id;
        return this;
    }

    findAll(params: ApiStateProvinceQueryInput = null) {
        this.queryParams = params;
        return this;
    }

    build() {
        let url = this.apiUrl;
        if (this.provinceID) {
            url = `${url}/${this.provinceID}`;
        }

        const urlObj = new URL(url);
        if (this.queryParams) {
            Object.keys(this.queryParams).forEach((k) => {
                urlObj.searchParams.set(k, this.queryParams[k].toString());
            })
        }
        return urlObj.toString();
    }
}
