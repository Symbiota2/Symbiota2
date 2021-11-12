import { Q_PARAM_TAXAIDS } from '../../../constants';
import { TaxonDescriptionBlockQueryBuilder } from '../taxonDescriptionBlock/taxonDescriptionBlock-query-builder';

export class TaxonDescriptionStatementQueryBuilder {
    protected baseUrl: string
    protected namesUrl: URL
    protected nameUrl: URL
    protected url: URL

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonDescriptionStatement`)
    }

    findAll(): FindAllBuilder {
        return new FindAllBuilder(this.baseUrl)
    }

    findDescriptions(): FindDescriptionsBuilder {
        return new FindDescriptionsBuilder(this.baseUrl)
    }

    findOne(): FindOneBuilder {
        return new FindOneBuilder(this.baseUrl)
    }

    create(): CreateOneBuilder {
        return new CreateOneBuilder(this.baseUrl);
    }

    delete(): DeleteOneBuilder {
        return new DeleteOneBuilder(this.baseUrl);
    }

    upload(): UploadBuilder {
        return new UploadBuilder(this.baseUrl);
    }

    build(): string {
        return this.url.toString()
    }
}

class CreateOneBuilder extends TaxonDescriptionStatementQueryBuilder {
    protected _myID: number;

    myID(id: number): CreateOneBuilder {
        this._myID = id;
        return this;
    }

    build(): string {
        return super.build();
    }
}

class DeleteOneBuilder extends TaxonDescriptionStatementQueryBuilder {
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

class UploadBuilder extends TaxonDescriptionStatementQueryBuilder {
    private _id: number = null;

    id(id: number): UploadBuilder {
        this._id = id;
        return this;
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}`;
        if (this._id) {
            this.url.pathname += `/${this._id}`;
        }
        return super.build();
    }
}


class FindOneBuilder extends TaxonDescriptionStatementQueryBuilder {
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

class FindAllBuilder extends TaxonDescriptionStatementQueryBuilder {
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

class FindDescriptionsBuilder extends TaxonDescriptionStatementQueryBuilder {
    protected _taxonIDs: number[] = []

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonDescriptionStatement/descriptions`)
    }

    taxonIDs(ids: number[]): FindDescriptionsBuilder {
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
