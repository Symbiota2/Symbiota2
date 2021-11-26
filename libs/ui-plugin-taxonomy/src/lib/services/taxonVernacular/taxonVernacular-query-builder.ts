import { Q_PARAM_AUTHORITYID, Q_PARAM_PARTIALNAME, Q_PARAM_TAXAIDS } from '../../../constants';
import { TaxonQueryBuilder } from '../taxon/taxon-query-builder';

export class TaxonVernacularQueryBuilder {
    protected baseUrl: string
    protected namesUrl: URL
    protected nameUrl: URL
    protected url: URL

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonVernacular`)
    }

    findCommonName(name: string) : FindCommonNameBuilder {
        return new FindCommonNameBuilder(this.baseUrl,name)
    }

    findByCommonName(name: string) : FindByCommonNameBuilder {
        return new FindByCommonNameBuilder(this.baseUrl,name)
    }

    findByTaxonID(taxonID: number) : FindByTaxonIDBuilder {
        return new FindByTaxonIDBuilder(this.baseUrl,taxonID)
    }

    findAllCommonNamesByLanguage(language: string) : FindAllCommonNamesByLanguageBuilder {
        return new FindAllCommonNamesByLanguageBuilder(this.baseUrl,language)
    }

    findAllCommonNames() : FindAllCommonNamesBuilder {
        return new FindAllCommonNamesBuilder(this.baseUrl)
    }

    findAllLanguages(): FindAllLanguagesBuilder {
        return new FindAllLanguagesBuilder(this.baseUrl)
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

class CreateOneBuilder extends TaxonVernacularQueryBuilder {
    protected _myID: number;

    myID(id: number): CreateOneBuilder {
        this._myID = id;
        return this;
    }

    build(): string {
        return super.build();
    }
}

class DeleteOneBuilder extends TaxonVernacularQueryBuilder {
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

class UploadBuilder extends TaxonVernacularQueryBuilder {
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

class FindByCommonNameBuilder extends TaxonVernacularQueryBuilder {
    protected _commonName: string = null
    protected _authorityID: number

    constructor(apiBaseUrl: string, name: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonVernacular/byCommonName/${name}`)
    }

    authorityID(authorityID: number): FindByCommonNameBuilder {
        this._authorityID = authorityID
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID.toString())
        }
        return super.build()
    }
}

class FindCommonNameBuilder extends TaxonVernacularQueryBuilder {
    protected _commonName: string = null
    protected _authorityID: number

    constructor(apiBaseUrl: string, name: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonVernacular/commonName/${name}`)
    }

    authorityID(authorityID: number): FindCommonNameBuilder {
        this._authorityID = authorityID
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID.toString())
        }
        return super.build()
    }
}


class FindOneBuilder extends TaxonVernacularQueryBuilder {
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

class FindAllLanguagesBuilder extends TaxonVernacularQueryBuilder {
    protected _authorityID: number
    protected _partialName: string

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonVernacular/languages`)
    }

    authorityID(authorityID: number): FindAllLanguagesBuilder {
        this._authorityID = authorityID
        return this
    }

    partialName(name: string): FindAllLanguagesBuilder {
        this._partialName = name
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID.toString())
        }

        if (this._partialName) {
            this.url.searchParams.append(Q_PARAM_PARTIALNAME, this._partialName)
        }
        return super.build();
    }
}

class FindAllCommonNamesByLanguageBuilder extends TaxonVernacularQueryBuilder {
    protected _authorityID: number
    protected _partialName: string

    constructor(apiBaseUrl: string, language: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonVernacular/commonNamesByLanguage/${language}`)
    }

    authorityID(authorityID: number): FindAllCommonNamesByLanguageBuilder {
        this._authorityID = authorityID
        return this
    }

    partialName(partialName: string): FindAllCommonNamesByLanguageBuilder {
        this._partialName = partialName
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID.toString())
        }
        if (this._partialName) {
            this.url.searchParams.append(Q_PARAM_PARTIALNAME, this._partialName)
        }
        return super.build();
    }
}

class FindByTaxonIDBuilder extends TaxonVernacularQueryBuilder {

    constructor(apiBaseUrl: string, taxonID: number) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonVernacular/taxonID/${taxonID}`)
    }

    build(): string {
        return super.build();
    }
}

class FindAllCommonNamesBuilder extends TaxonVernacularQueryBuilder {
    protected _authorityID: number
    protected _partialName: string

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonVernacular/commonNames`)
    }

    authorityID(authorityID: number): FindAllCommonNamesBuilder {
        this._authorityID = authorityID
        return this
    }

    partialName(partialName: string): FindAllCommonNamesBuilder {
        this._partialName = partialName
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID.toString())
        }
        if (this._partialName) {
            this.url.searchParams.append(Q_PARAM_PARTIALNAME, this._partialName)
        }
        return super.build();
    }
}

class FindAllBuilder extends TaxonVernacularQueryBuilder {
    protected _taxonIDs: number[] = []
    protected _authorityID: number

    IDs(ids: number[]): FindAllBuilder {
        this._taxonIDs = ids
        return this
    }

    authorityID(authorityID: number): FindAllBuilder {
        if (authorityID) this._authorityID = authorityID
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID.toString())
        }
        this._taxonIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_TAXAIDS, id.toString());
        })

        return super.build();
    }
}
