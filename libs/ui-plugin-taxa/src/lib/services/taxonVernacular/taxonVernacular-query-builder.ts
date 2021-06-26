import { Q_PARAM_AUTHORITYID, Q_PARAM_TAXAIDS } from '../../../constants';

export class TaxonVernacularQueryBuilder {
    protected baseUrl: string
    protected namesUrl: URL
    protected nameUrl: URL
    protected url: URL

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxon`)
    }

    findCommonName(name: string) : FindCommonNameBuilder {
        return new FindCommonNameBuilder(this.baseUrl,name)
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

    build(): string {
        return this.url.toString()
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

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonVernacular/languages`)
    }

    authorityID(authorityID: number): FindAllLanguagesBuilder {
        this._authorityID = authorityID
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID.toString())
        }
        return super.build();
    }
}

class FindAllCommonNamesByLanguageBuilder extends TaxonVernacularQueryBuilder {
    protected _authorityID: number

    constructor(apiBaseUrl: string, language: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonVernacular/commonNamesByLanguage/${language}`)
    }

    authorityID(authorityID: number): FindAllCommonNamesByLanguageBuilder {
        this._authorityID = authorityID
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID.toString())
        }
        return super.build();
    }
}

class FindAllCommonNamesBuilder extends TaxonVernacularQueryBuilder {
    protected _authorityID: number

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonVernacular/commonNames`)
    }

    authorityID(authorityID: number): FindAllCommonNamesBuilder {
        this._authorityID = authorityID
        return this
    }

    build(): string {
        if (this._authorityID) {
            this.url.searchParams.append(Q_PARAM_AUTHORITYID, this._authorityID.toString())
        }
        return super.build();
    }
}

class FindAllBuilder extends TaxonVernacularQueryBuilder {
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
            this.url.searchParams.append(Q_PARAM_TAXAIDS, id.toString());
        })

        return super.build();
    }
}
