import { Q_PARAM_TAXAIDS } from '../../../constants';

export class ImageQueryBuilder {
    protected baseUrl: string
    protected namesUrl: URL
    protected nameUrl: URL
    protected url: URL

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/image`)
    }

    findAll(): FindAllBuilder {
        return new FindAllBuilder(this.baseUrl)
    }

    findPhotographers(): FindPhotographersBuilder {
        return new FindPhotographersBuilder(this.baseUrl)
    }

    findPhotographerNames(): FindPhotographerNamesBuilder {
        return new FindPhotographerNamesBuilder(this.baseUrl)
    }

    findByTaxonIDs(): FindByTaxonIDsBuilder {
        return new FindByTaxonIDsBuilder(this.baseUrl)
    }

    findDescriptions(): FindDescriptionsBuilder {
        return new FindDescriptionsBuilder(this.baseUrl)
    }

    findOne(): FindOneBuilder {
        return new FindOneBuilder(this.baseUrl)
    }

    build(): string {
        return this.url.toString()
    }
}

class FindOneBuilder extends ImageQueryBuilder {
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

class FindAllBuilder extends ImageQueryBuilder {
    protected _imageIDs: number[] = [];

    imageIDs(ids: number[]): FindAllBuilder {
        this._imageIDs = ids
        return this
    }

    build(): string {
        this._imageIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_TAXAIDS, id.toString());
        })

        return super.build();
    }
}

class FindPhotographersBuilder extends ImageQueryBuilder {

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/image/photographers`)
    }

    build(): string {
        return super.build();
    }

}


class FindPhotographerNamesBuilder extends ImageQueryBuilder {

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/image/photographerNames`)
    }

    build(): string {
        return super.build();
    }

}

class FindByTaxonIDsBuilder extends ImageQueryBuilder {
    protected _taxonIDs: number[] = []

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/image/taxonIDs`)
    }

    taxonIDs(ids: number[]): FindByTaxonIDsBuilder {
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

class FindDescriptionsBuilder extends ImageQueryBuilder {
    protected _taxonIDs: number[] = []

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/image/descriptions`)
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
