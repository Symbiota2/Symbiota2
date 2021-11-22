import { Q_PARAM_AUTHORITYID, Q_PARAM_TAXAIDS } from '../../../constants';
import { TaxonDescriptionBlockQueryBuilder } from '../taxonDescriptionBlock/taxonDescriptionBlock-query-builder';

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

    findSynonyms() : FindSynonymsBuilder {
        return new FindSynonymsBuilder(this.baseUrl)
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

class CreateOneBuilder extends TaxonomicStatusQueryBuilder {
    protected _myID: number

    myID(id: number): CreateOneBuilder {
        this._myID = id
        return this
    }

    build(): string {
        return super.build()
    }
}

class DeleteOneBuilder extends TaxonomicStatusQueryBuilder {
    protected _id: number
    protected _authorityId: number
    protected _acceptedId: number

    id(id: number): DeleteOneBuilder {
        this._id = id
        return this;
    }

    authorityId(id: number): DeleteOneBuilder {
        this._authorityId = id
        return this;
    }

    acceptedId(id: number): DeleteOneBuilder {
        this._acceptedId = id
        return this;
    }

    build(): string {
        // Should have all of these to work
        this.url.pathname += `/${this._id}/${this._authorityId}/${this._acceptedId}`
        return super.build()
    }
}

class UploadBuilder extends TaxonomicStatusQueryBuilder {
    protected _id: number
    protected _authorityId: number
    protected _acceptedId: number

    id(id: number): UploadBuilder {
        this._id = id
        return this;
    }

    authorityId(id: number): UploadBuilder {
        this._authorityId = id
        return this;
    }

    acceptedId(id: number): UploadBuilder {
        this._acceptedId = id
        return this;
    }

    build(): string {
        // Should have all of these to work
        this.url.pathname += `/${this._id}/${this._authorityId}/${this._acceptedId}`
        return super.build()
    }
}

class FindOneBuilder extends TaxonomicStatusQueryBuilder {
    protected _id: number
    protected _authorityId: number
    protected _acceptedId: number

    id(id: number): FindOneBuilder {
        this._id = id
        return this;
    }

    authorityId(id: number): FindOneBuilder {
        this._authorityId = id
        return this;
    }

    acceptedId(id: number): FindOneBuilder {
        this._acceptedId = id
        return this;
    }

    build(): string {
        // Should have all of these to work
        this.url.pathname += `/${this._id}/${this._authorityId}/${this._acceptedId}`
        return super.build()
    }
}

class FindSynonymsBuilder extends TaxonomicStatusQueryBuilder {
    protected _taxonID: number = null

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonomicStatus/synonyms`)
    }

    taxonID(id: number): FindSynonymsBuilder {
        this._taxonID = id
        this.url = new URL(`${this.baseUrl}/taxonomicStatus/synonyms/${id}`)
        return this
    }

    build(): string {
        return super.build();
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
