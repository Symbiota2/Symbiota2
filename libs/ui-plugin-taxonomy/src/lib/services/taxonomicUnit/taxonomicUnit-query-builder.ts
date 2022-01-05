import { Q_PARAM_TAXAIDS } from '../../../constants';

export class TaxonomicUnitQueryBuilder {
    protected baseUrl: string
    protected namesUrl: URL
    protected nameUrl: URL
    protected url: URL

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonomicUnit`)
    }

    findAll(): FindAllBuilder {
        return new FindAllBuilder(this.baseUrl)
    }

    findKingdomNames(): FindKingdomNamesBuilder {
        return new FindKingdomNamesBuilder(this.baseUrl)
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

class CreateOneBuilder extends TaxonomicUnitQueryBuilder {
    protected _myID: number;

    myID(id: number): CreateOneBuilder {
        this._myID = id;
        return this;
    }

    build(): string {
        return super.build();
    }
}

class DeleteOneBuilder extends TaxonomicUnitQueryBuilder {
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

class UploadBuilder extends TaxonomicUnitQueryBuilder {
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

class FindOneBuilder extends TaxonomicUnitQueryBuilder {
    protected _taxonID: number = null

    id(id: number): FindOneBuilder {
        this._taxonID = id
        return this
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/${this._taxonID}`
        return super.build()
    }
}

class FindKingdomNamesBuilder extends TaxonomicUnitQueryBuilder {

    build(): string {
        this.url.pathname = `${this.url.pathname}/kingdomNames`
        return super.build();
    }
}

class FindAllBuilder extends TaxonomicUnitQueryBuilder {
    protected _taxonIDs: number[] = []

    IDs(ids: number[]): FindAllBuilder {
        if (ids) {
            this._taxonIDs = ids
        }
        return this
    }

    build(): string {
        this._taxonIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_TAXAIDS, id.toString());
        })

        return super.build();
    }
}
