import { Q_PARAM_AUTHORITYID, Q_PARAM_TAXAIDS } from '../../../constants';

export class TaxonomicStatusQueryBuilder {
    protected baseUrl: string
    protected url: URL
    protected authorityID: number

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonomicStatus`)
    }

    taxonomicAuthorityID(id: number) : TaxonomicStatusQueryBuilder {
        this.authorityID = id
        return this
    }

    findChildren() : FindChildrenBuilder {
        return new FindChildrenBuilder(this.baseUrl)
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


class FindOneBuilder extends TaxonomicStatusQueryBuilder {
    protected taxonID: number = null


    id(id: number): FindOneBuilder {
        this.taxonID = id
        return this
    }


    build(): string {
        this.url.pathname = `${this.url.pathname}/${this.taxonID.toString()}`;
        return super.build()
    }
}

class FindChildrenBuilder extends TaxonomicStatusQueryBuilder {
    protected _taxonID: number = null

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonomicStatus/children`)
    }

    taxonID(id: number): FindChildrenBuilder {
        this._taxonID = id
        this.url = new URL(`${this.baseUrl}/taxonomicStatus/children/${id}`)
        return this
    }

    build(): string {
        //this.url = new URL(`${this.url.pathname}/scientificNames`)
        //this.url = this.namesUrl
        return super.build();
    }
}

class FindAllBuilder extends TaxonomicStatusQueryBuilder {
    protected _taxonIDs: number[] = [];

    taxonIDs(ids: number[]): FindAllBuilder {
        this._taxonIDs = ids
        return this
    }

    build(): string {
        if (this.authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this.authorityID.toString())
        }
        this._taxonIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_TAXAIDS, id.toString());
        })


        return super.build();
    }
}
