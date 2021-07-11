import { Q_PARAM_TAXAIDS } from '../../../constants';

export class TaxonDescriptionBlockQueryBuilder {
    protected baseUrl: string
    protected namesUrl: URL
    protected nameUrl: URL
    protected url: URL

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonDescriptionBlock`)
    }

    findAll(): FindAllBuilder {
        return new FindAllBuilder(this.baseUrl)
    }

    findBlockByTaxonID(tid: number): FindBlockByTaxonIDBuilder {
        return new FindBlockByTaxonIDBuilder(this.baseUrl,tid)
    }

    findOne(): FindOneBuilder {
        return new FindOneBuilder(this.baseUrl)
    }

    build(): string {
        return this.url.toString()
    }
}

class FindOneBuilder extends TaxonDescriptionBlockQueryBuilder {
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

class FindAllBuilder extends TaxonDescriptionBlockQueryBuilder {
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

class FindBlockByTaxonIDBuilder extends TaxonDescriptionBlockQueryBuilder {
    protected _taxonID: number

    constructor(apiBaseUrl: string, tid: number) {
        super(apiBaseUrl)
        this._taxonID = tid
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonDescriptionBlock/blockAndImages/` + tid.toString())
    }

    build(): string {
        return super.build();
    }
}
