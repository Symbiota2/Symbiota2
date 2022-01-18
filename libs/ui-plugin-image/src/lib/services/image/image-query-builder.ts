import {
    Q_PARAM_COMMON_NAMES,
    Q_PARAM_COUNTRIES, Q_PARAM_END_DATE,
    Q_PARAM_IMAGE_PHOTOGRAPHER_NAMES,
    Q_PARAM_IMAGE_TAGS,
    Q_PARAM_IMAGE_TYPES, Q_PARAM_KEYWORDS, Q_PARAM_LIMIT_OCCURRENCES, Q_PARAM_LIMIT_TAXONS,
    Q_PARAM_PROVINCES, Q_PARAM_SCIENTIFIC_NAMES, Q_PARAM_START_DATE,
    Q_PARAM_TAXAIDS
} from '../../../constants';
import { TaxonQueryBuilder } from '../../../../../ui-plugin-taxonomy/src/lib/services/taxon/taxon-query-builder';
import { Q_PARAM_COLLID } from '../../../../../ui-plugin-occurrence/src/constants';

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

    imageContributorsSearch(): ImageContributorsSearchBuilder {
        return new ImageContributorsSearchBuilder(this.baseUrl)
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

    create(): CreateOneBuilder {
        return new CreateOneBuilder(this.baseUrl);
    }

    delete(): DeleteOneBuilder {
        return new DeleteOneBuilder(this.baseUrl);
    }

    upload(): UploadBuilder {
        return new UploadBuilder(this.baseUrl);
    }

    fileUpload(): FileUploadBuilder {
        return new FileUploadBuilder(this.baseUrl);
    }

    build(): string {
        return this.url.toString()
    }
}

class CreateOneBuilder extends ImageQueryBuilder {
    protected _myID: number;

    myID(id: number): CreateOneBuilder {
        this._myID = id;
        return this;
    }

    build(): string {
        return super.build();
    }
}

class DeleteOneBuilder extends ImageQueryBuilder {
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

class FileUploadBuilder extends ImageQueryBuilder {
    private _filename: string = null
    private _storageService: boolean = false

    filename(name: string): FileUploadBuilder {
        this._filename = name
        return this;
    }

    useS3() {
        this._storageService = true
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/imglib`
        if (this._filename) {
            this.url.pathname += `/${this._filename}`
        }
        if (this._storageService) {
            this.url.pathname += `/${this._storageService}`
        }
        return super.build()
    }
}

class UploadBuilder extends ImageQueryBuilder {
    private _id: number = null;
    private _authID: number = null

    id(id: number): UploadBuilder {
        this._id = id;
        return this;
    }

    authorityID(id: number): UploadBuilder {
        this._authID = id;
        return this;
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/upload`;
        if (this._id) {
            this.url.pathname += `/${this._id}`;
        }
        if (this._authID) {
            this.url.pathname += `/${this._authID}`;
        }
        return super.build();
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
class ImageContributorsSearchBuilder extends ImageQueryBuilder {
    protected _tagKeys: string[] = []
    protected _imageTypes: string[] = []
    protected _photographers: string[] = []
    protected _keywords: string[] = []
    protected _startDate: Date
    protected _endDate: Date
    protected _scientificNames: string[] = []
    protected _commonNames: string[] = []
    protected _limitTaxons: boolean = false
    protected _limitOccurrences: boolean = false
    protected _collectionIDs: number[] = []

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/image/contributorsSearch`)
    }

    collectionIDs(ids: number[]): ImageContributorsSearchBuilder {
        this._collectionIDs= ids
        return this
    }
    scientificNames(names: string[]): ImageContributorsSearchBuilder {
        this._scientificNames = names
        return this
    }
    commonNames(names: string[]): ImageContributorsSearchBuilder {
        this._commonNames = names
        return this
    }
    keywords(words: string[]): ImageContributorsSearchBuilder {
        this._keywords = words
        return this
    }
    startDate(date: Date): ImageContributorsSearchBuilder {
        this._startDate = date
        return this
    }
    endDate(date: Date): ImageContributorsSearchBuilder {
        this._endDate = date
        return this
    }
    tagKeys(keys: string[]): ImageContributorsSearchBuilder {
        this._tagKeys = keys
        return this
    }
    imageTypes(types: string[]): ImageContributorsSearchBuilder {
        this._imageTypes = types
        return this
    }
    photographers(names: string[]): ImageContributorsSearchBuilder {
        this._photographers = names
        return this
    }
    limitTaxons(value: boolean): ImageContributorsSearchBuilder {
        this._limitTaxons = value
        return this
    }
    limitOccurrences(value: boolean): ImageContributorsSearchBuilder {
        this._limitOccurrences = value
        return this
    }

    build(): string {
        this._collectionIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_COLLID, id.toString())
        })
        this._keywords.forEach((word) => {
            this.url.searchParams.append(Q_PARAM_KEYWORDS, word.toString())
        })
        this._scientificNames.forEach((name) => {
            this.url.searchParams.append(Q_PARAM_SCIENTIFIC_NAMES, name)
        })
        this._commonNames.forEach((name) => {
            this.url.searchParams.append(Q_PARAM_COMMON_NAMES, name)
        })
        if (this._startDate) {
            this.url.searchParams.append(Q_PARAM_START_DATE, this._startDate.toDateString())
        }
        if (this._endDate) {
            this.url.searchParams.append(Q_PARAM_END_DATE, this._endDate.toDateString())
        }
        if (this._limitTaxons) {
            this.url.searchParams.append(Q_PARAM_LIMIT_TAXONS, "yes")
        }
        if (this._limitOccurrences) {
            this.url.searchParams.append(Q_PARAM_LIMIT_OCCURRENCES, "yes")
        }
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
