import { Q_PARAM_TAXAIDS, Q_PARAM_AUTHORITYID, Q_PARAM_PARENTID, Q_PARAM_TAXAID } from '../../../constants';
import { TaxonDescriptionBlockQueryBuilder } from '../taxonDescriptionBlock/taxonDescriptionBlock-query-builder';

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

    findDescendants() : FindDescendantsBuilder {
        return new FindDescendantsBuilder(this.baseUrl)
    }

    findDescendantsByRank() : FindDescendantsByRankBuilder {
        return new FindDescendantsByRankBuilder(this.baseUrl)
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

    create(): CreateOneBuilder {
        return new CreateOneBuilder(this.baseUrl);
    }

    move(): MoveBuilder {
        return new MoveBuilder(this.baseUrl);
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

class CreateOneBuilder extends TaxonomicEnumTreeQueryBuilder {
    protected _myID: number;

    myID(id: number): CreateOneBuilder {
        this._myID = id;
        return this;
    }

    build(): string {
        return super.build();
    }
}

class MoveBuilder extends TaxonomicEnumTreeQueryBuilder {
    protected _id: number
    protected _parentId: number
    protected _authorityId: number

    id(id: number): MoveBuilder {
        this._id = id
        return this;
    }

    parentId(id: number): MoveBuilder {
        this._parentId = id
        return this;
    }

    authorityId(id: number): MoveBuilder {
        this._authorityId = id
        return this
    }

    build(): string {
        this.url.searchParams.append(Q_PARAM_TAXAID, this._id.toString())
        this.url.searchParams.append(Q_PARAM_PARENTID, this._parentId.toString())
        this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityId.toString())
        this.url.pathname += `/move`
        return super.build();
    }
}

class DeleteOneBuilder extends TaxonomicEnumTreeQueryBuilder {
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

class UploadBuilder extends TaxonomicEnumTreeQueryBuilder {
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

class FindDescendantsBuilder extends TaxonomicEnumTreeQueryBuilder {
    protected _taxonID: number = null
    protected _authorityID: number

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonomicEnumTree/descendants`)
    }

    authorityID(authorityID: number): FindDescendantsBuilder {
        this._authorityID = authorityID
        return this
    }

    taxonID(id: number): FindDescendantsBuilder {
        this._taxonID = id
        this.url = new URL(`${this.baseUrl}/taxonomicEnumTree/descendants/${id}`)
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID.toString())
        }

        return super.build();
    }
}

class FindDescendantsByRankBuilder extends TaxonomicEnumTreeQueryBuilder {
    protected _taxonID: number = null
    protected _authorityID: number
    protected _rankID: number = null

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonomicEnumTree/descendantsByRank`)
    }

    authorityID(authorityID: number): FindDescendantsByRankBuilder {
        this._authorityID = authorityID
        return this
    }

    taxonID(id: number): FindDescendantsByRankBuilder {
        this._taxonID = id
        this.url = new URL(`${this.baseUrl}/taxonomicEnumTree/descendantsByRank/${this._taxonID}/${this._rankID}`)
        return this
    }

    rankID(id: number): FindDescendantsByRankBuilder {
        this._rankID = id
        this.url = new URL(`${this.baseUrl}/taxonomicEnumTree/descendantsByRank/${this._taxonID}/${this._rankID}`)
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
