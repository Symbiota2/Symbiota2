import { Q_PARAM_TAXAIDS } from '../../../constants';
import { OccurrenceQueryBuilder } from '../../../../../ui-plugin-occurrence/src/lib/services/occurrence-query-builder';

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

    findBlocksByTaxonID(tid: number): FindBlocksByTaxonIDBuilder {
        return new FindBlocksByTaxonIDBuilder(this.baseUrl,tid)
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

class CreateOneBuilder extends TaxonDescriptionBlockQueryBuilder {
    protected _myID: number;

    myID(id: number): CreateOneBuilder {
        this._myID = id;
        return this;
    }

    build(): string {
        return super.build();
    }
}

class DeleteOneBuilder extends TaxonDescriptionBlockQueryBuilder {
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

class UploadBuilder extends TaxonDescriptionBlockQueryBuilder {
    private _id: number = null;

    id(id: number): UploadBuilder {
        this._id = id;
        return this;
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/upload`;
        if (this._id) {
            this.url.pathname += `/${this._id}`;
        }
        return super.build();
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

class FindBlocksByTaxonIDBuilder extends TaxonDescriptionBlockQueryBuilder {
    protected _taxonID: number

    constructor(apiBaseUrl: string, tid: number) {
        super(apiBaseUrl)
        this._taxonID = tid
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonDescriptionBlock/blocksAndImages/` + tid.toString())
    }

    build(): string {
        return super.build();
    }
}
