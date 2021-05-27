import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';

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
