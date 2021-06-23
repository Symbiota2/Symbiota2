import { Q_PARAM_TAXAIDS } from '../../../constants';

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

    constructor(apiBaseUrl: string, name: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonVernacular/commonName/${name}`)
    }

    build(): string {
        return super.build()
    }
}


class FindOneBuilder extends TaxonVernacularQueryBuilder {
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

class FindAllLanguagesBuilder extends TaxonVernacularQueryBuilder {

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonVernacular/languages`)
    }

    build(): string {
        return super.build();
    }
}

class FindAllCommonNamesByLanguageBuilder extends TaxonVernacularQueryBuilder {

    constructor(apiBaseUrl: string, language: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonVernacular/commonNamesByLanguage/${language}`)
    }

    build(): string {
        return super.build();
    }
}

class FindAllCommonNamesBuilder extends TaxonVernacularQueryBuilder {

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/taxonVernacular/commonNames`)
    }

    build(): string {
        return super.build();
    }
}

class FindAllBuilder extends TaxonVernacularQueryBuilder {
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
