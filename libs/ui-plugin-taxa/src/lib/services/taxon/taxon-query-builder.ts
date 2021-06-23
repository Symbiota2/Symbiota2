import { Q_PARAM_TAXAIDS, Q_PARAM_AUTHORITYID } from '../../../constants';

export class TaxonQueryBuilder {
    protected baseUrl: string
    protected namesUrl: URL
    protected nameUrl: URL
    protected url: URL
    protected _authorityID: string

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

    authorityID(authorityID? : string): TaxonQueryBuilder {
        this._authorityID = authorityID? authorityID : undefined
        return this
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

    build(): string {
        this.url.pathname = `${this.url.pathname}/${this._scientificName}`;
        return super.build()
    }
}


class FindOneBuilder extends TaxonQueryBuilder {
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

class FindAllScientificNamesBuilder extends TaxonQueryBuilder {

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxon/scientificNames`)
    }

    build(): string {
        //this.url = new URL(`${this.url.pathname}/scientificNames`)
        //this.url = this.namesUrl
        return super.build();
    }
}

class FindAllScientificNamesPlusAuthorsBuilder extends TaxonQueryBuilder {

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxon/scientificNamesPlusAuthors`)
    }

    build(): string {
        //this.url = new URL(`${this.url.pathname}/scientificNames`)
        //this.url = this.namesUrl
        return super.build();
    }
}

class FindAllBuilder extends TaxonQueryBuilder {
    protected _taxonIDs: number[] = [];

    taxonIDs(ids: number[]): FindAllBuilder {
        this._taxonIDs = ids
        return this
    }

    build(): string {
        this._taxonIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_TAXAIDS, id.toString());
        })
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID)
        }

        return super.build();
    }
}
