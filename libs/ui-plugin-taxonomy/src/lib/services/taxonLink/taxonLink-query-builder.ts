import { Q_PARAM_TAXAIDS, Q_PARAM_TAXONIDS } from '../../../constants';
import { TaxonResourceLinkQueryBuilder } from '../taxonResourceLink/taxonResourceLink-query-builder';

export class TaxonLinkQueryBuilder {
    protected baseUrl: string
    protected namesUrl: URL
    protected nameUrl: URL
    protected url: URL

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonLink`)
    }

    findAll(): FindAllBuilder {
        return new FindAllBuilder(this.baseUrl)
    }

    findOne(): FindOneBuilder {
        return new FindOneBuilder(this.baseUrl)
    }

    delete(): DeleteOneBuilder {
        return new DeleteOneBuilder(this.baseUrl);
    }

    build(): string {
        return this.url.toString()
    }
}


class FindOneBuilder extends TaxonLinkQueryBuilder {
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

class FindAllBuilder extends TaxonLinkQueryBuilder {
    protected _taxonIDs: number[] = []
    protected _ids: number[] = []

    ids(ids: number[]): FindAllBuilder {
        this._ids = ids
        return this
    }

    taxonIDs(ids: number[]): FindAllBuilder {
        this._taxonIDs = ids
        return this
    }

    build(): string {
        this._ids.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_TAXAIDS, id.toString())
        })
        this._taxonIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_TAXONIDS, id.toString())
        })

        return super.build();
    }
}

class DeleteOneBuilder extends TaxonLinkQueryBuilder {
    protected _id: number;

    id(id: number): DeleteOneBuilder {
        this._id = id
        return this;
    }

    build(): string {
        if (this._id) {
            this.url.pathname += `/${this._id}`
        }
        return super.build()
    }
}
