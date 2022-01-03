import {
    Q_PARAM_COUNTRIES,
    Q_PARAM_IMAGE_PHOTOGRAPHER_NAMES,
    Q_PARAM_IMAGE_TAGS,
    Q_PARAM_IMAGE_TYPES,
    Q_PARAM_PROVINCES,
    Q_PARAM_TAXAIDS
} from '../../../constants';

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

    findImageTypes(): FindImageTypesBuilder {
        return new FindImageTypesBuilder(this.baseUrl)
    }

    findByTaxonIDs(): FindByTaxonIDsBuilder {
        return new FindByTaxonIDsBuilder(this.baseUrl)
    }

    imageSearch(): ImageSearchBuilder {
        return new ImageSearchBuilder(this.baseUrl)
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

class FindImageTypesBuilder extends ImageQueryBuilder {

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/image/imageTypes`)
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

class ImageSearchBuilder extends ImageQueryBuilder {
    protected _taxonIDs: number[] = []
    protected _tagKeys: string[] = []
    protected _imageTypes: string[] = []
    protected _photographers: string[] = []
    protected _countries: string[] = []
    protected _provinces: string[] = []

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/image/search`)
    }

    taxonIDs(ids: number[]): ImageSearchBuilder {
        this._taxonIDs = ids
        return this
    }
    countries(ids: string[]): ImageSearchBuilder {
        this._countries = ids
        return this
    }
    provinces(ids: string[]): ImageSearchBuilder {
        this._provinces = ids
        return this
    }
    tagKeys(keys: string[]): ImageSearchBuilder {
        this._tagKeys = keys
        return this
    }
    imageTypes(types: string[]): ImageSearchBuilder {
        this._imageTypes = types
        return this
    }
    photographers(names: string[]): ImageSearchBuilder {
        this._photographers = names
        return this
    }

    build(): string {
        this._taxonIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_TAXAIDS, id.toString())
        })
        this._provinces.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_PROVINCES, id)
        })
        this._countries.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_COUNTRIES, id)
        })
        this._photographers.forEach((name) => {
            this.url.searchParams.append(Q_PARAM_IMAGE_PHOTOGRAPHER_NAMES, name)
        })
        this._imageTypes.forEach((type) => {
            this.url.searchParams.append(Q_PARAM_IMAGE_TYPES, type)
        })
        this._tagKeys.forEach((key) => {
            this.url.searchParams.append(Q_PARAM_IMAGE_TAGS, key)
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
