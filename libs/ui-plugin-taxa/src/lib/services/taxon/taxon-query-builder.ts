import { Q_PARAM_TAXAIDS, Q_PARAM_AUTHORITYID } from '../../../constants';

export class TaxonQueryBuilder {
    protected baseUrl: string
    protected namesUrl: URL
    protected nameUrl: URL
    protected url: URL
    _authorityID: string

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxon`)
    }

    findAllScientificNames() : FindAllScientificNamesBuilder {
        return new FindAllScientificNamesBuilder(this.baseUrl)
    }

    findAllScientificNamesPlusAuthors() : FindAllScientificNamesPlusAuthorsBuilder {
        return new FindAllScientificNamesPlusAuthorsBuilder(this.baseUrl)
    }

    findScientificName() : FindScientificNameBuilder {
        return new FindScientificNameBuilder(this.baseUrl)
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

class FindScientificNameBuilder extends TaxonQueryBuilder {
    protected _scientificName: string = null

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxon/scientificName`)
    }

    scientificName(sciName: string): FindScientificNameBuilder {
        this._scientificName = sciName
        return this
    }

    authorityID(authorityID : string): FindScientificNameBuilder {
        this._authorityID = authorityID
        return this
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/${this._scientificName}`
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID)
        }
        return super.build()
    }
}

class FindOneBuilder extends TaxonQueryBuilder {
    protected taxonID: number = null

    id(id: number): FindOneBuilder {
        this.taxonID = id
        return this
    }


    authorityID(authorityID? : string): FindOneBuilder {
        this._authorityID = authorityID? authorityID : undefined
        return this
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/${this.taxonID}`
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID)
        }
        return super.build()
    }
}

class FindAllScientificNamesBuilder extends TaxonQueryBuilder {

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxon/scientificNames`)
    }

    authorityID(authorityID : string): FindAllScientificNamesBuilder {
        this._authorityID = authorityID
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID)
        }

        return super.build()
    }
}

class FindAllScientificNamesPlusAuthorsBuilder extends TaxonQueryBuilder {

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxon/scientificNamesPlusAuthors`)
    }


    authorityID(authorityID : string): FindAllScientificNamesPlusAuthorsBuilder {
        this._authorityID = authorityID
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID)
        }
        return super.build();
    }
}

class FindAllBuilder extends TaxonQueryBuilder {
    protected _taxonIDs: number[] = [];

    taxonIDs(ids: number[]): FindAllBuilder {
        this._taxonIDs = ids
        return this
    }

    authorityID(authorityID? : string): FindAllBuilder {
        this._authorityID = authorityID? authorityID : undefined
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID)
        }
        this._taxonIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_TAXAIDS, id.toString());
        })

        return super.build();
    }
}
