import { Q_PARAM_TAXAIDS, Q_PARAM_AUTHORITYID } from '../../../constants';

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
    protected _taxonID: number = null
    protected _authorityID: number

    id(id: number): FindOneBuilder {
        this._taxonID = id
        return this
    }

    authorityID(authorityID: number): FindOneBuilder {
        this._authorityID = authorityID
        return this
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/${this._taxonID}`
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID.toString())
        }
        return super.build()
    }
}

class FindAncestorsBuilder extends TaxonomicEnumTreeQueryBuilder {
    protected _taxonID: number = null
    protected _authorityID: number

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonomicEnumTree/ancestors`)
    }

    authorityID(authorityID: number): FindAncestorsBuilder {
        this._authorityID = authorityID
        return this
    }

    taxonID(id: number): FindAncestorsBuilder {
        this._taxonID = id
        this.url = new URL(`${this.baseUrl}/taxonomicEnumTree/ancestors/${id}`)
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID.toString())
        }

        return super.build();
    }
}

class FindAncestorTaxonsBuilder extends TaxonomicEnumTreeQueryBuilder {
    protected _taxonID: number = null
    protected _authorityID: number

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonomicEnumTree/ancestorTaxons`)
    }

    authorityID(authorityID: number): FindAncestorTaxonsBuilder {
        this._authorityID = authorityID
        return this
    }

    taxonID(id: number): FindAncestorTaxonsBuilder {
        this._taxonID = id
        this.url = new URL(`${this.baseUrl}/taxonomicEnumTree/ancestorTaxons/${id}`)
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID.toString())
        }

        return super.build();
    }
}

class FindAllBuilder extends TaxonomicEnumTreeQueryBuilder {
    protected _taxonIDs: number[] = []
    protected _authorityID: number

    taxonIDs(ids: number[]): FindAllBuilder {
        this._taxonIDs = ids
        return this
    }

    authorityID(authorityID: number): FindAllBuilder {
        this._authorityID = authorityID
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID.toString())
        }

        this._taxonIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_TAXAIDS, id.toString())
        })


        return super.build();
    }
}
