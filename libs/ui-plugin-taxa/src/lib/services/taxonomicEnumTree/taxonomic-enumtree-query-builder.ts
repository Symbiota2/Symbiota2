import { Q_PARAM_TAXAIDS } from '../../../constants';

export class TaxonomicEnumTreeQueryBuilder {
    protected baseUrl: string
    protected namesUrl: URL
    protected nameUrl: URL
    protected url: URL

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonomicEnumTree`)
    }

    findAncestors() : FindAncestorsBuilder {
        return new FindAncestorsBuilder(this.baseUrl)
    }

    findAncestorTaxons() : FindAncestorTaxonsBuilder {
        return new FindAncestorTaxonsBuilder(this.baseUrl)
    }

    findAll(): FindAllBuilder {
        return new FindAllBuilder(this.baseUrl)
    }

    findOne(): FindOneBuilder {
        return new FindOneBuilder(this.baseUrl)
    }

    build(): string {
        return this.url.toString()
    }
}


class FindOneBuilder extends TaxonomicEnumTreeQueryBuilder {
    protected taxonID: number = null

    id(id: number): FindOneBuilder {
        this.taxonID = id
        return this
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/${this.taxonID}`;
        return super.build()
    }
}

class FindAncestorsBuilder extends TaxonomicEnumTreeQueryBuilder {
    protected _taxonID: number = null

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonomicEnumTree/ancestors`)
    }

    taxonID(id: number): FindAncestorsBuilder {
        this._taxonID = id
        this.url = new URL(`${this.baseUrl}/taxonomicEnumTree/ancestors/${id}`)
        return this
    }

    build(): string {
        return super.build();
    }
}

class FindAncestorTaxonsBuilder extends TaxonomicEnumTreeQueryBuilder {
    protected _taxonID: number = null

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonomicEnumTree/ancestorTaxons`)
    }

    taxonID(id: number): FindAncestorTaxonsBuilder {
        this._taxonID = id
        this.url = new URL(`${this.baseUrl}/taxonomicEnumTree/ancestorTaxons/${id}`)
        return this
    }

    build(): string {
        return super.build();
    }
}

class FindAllBuilder extends TaxonomicEnumTreeQueryBuilder {
    protected _taxonIDs: number[] = [];

    taxonIDs(ids: number[]): FindAllBuilder {
        this._taxonIDs = ids
        return this
    }

    build(): string {
        this._taxonIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_TAXAIDS, id.toString());
        })

        return super.build();
    }
}
