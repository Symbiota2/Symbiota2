import {
    Q_PARAM_IDS
} from '../../../constants';
import { KNOWLEDGE_GRAPH_API_BASE } from '../../routes';

export class KnowledgeGraphQueryBuilder {
    protected baseUrl: string
    protected namesUrl: URL
    protected nameUrl: URL
    protected url: URL

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/${KNOWLEDGE_GRAPH_API_BASE}`)
    }

    findAll(): FindAllBuilder {
        return new FindAllBuilder(this.baseUrl)
    }

    findByTaxonIDs(): FindByTaxonIDsBuilder {
        return new FindByTaxonIDsBuilder(this.baseUrl)
    }

    /*
    findDescriptions(): FindDescriptionsBuilder {
        return new FindDescriptionsBuilder(this.baseUrl)
    }
     */

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

    zipFileUpload(): ZipFileUploadBuilder {
        return new ZipFileUploadBuilder(this.baseUrl);
    }

    build(): string {
        return this.url.toString()
    }
}

class CreateOneBuilder extends KnowledgeGraphQueryBuilder {
    protected _myID: number;

    myID(id: number): CreateOneBuilder {
        this._myID = id
        return this
    }

    build(): string {
        return super.build();
    }
}

// Can delete by image id or by taxonid but not both!
class DeleteOneBuilder extends KnowledgeGraphQueryBuilder {
    protected _id: number;
    protected _taxonID: number;

    id(id: number): DeleteOneBuilder {
        this._id = id
        return this;
    }

    taxonID(id: number): DeleteOneBuilder {
        this._taxonID = id
        return this;
    }

    build(): string {
        if (this._taxonID) {
            this.url.pathname += `taxonID/${this._taxonID}`
        } else if (this._id) {
            this.url.pathname += `/${this._id}`
        }
        return super.build()
    }
}

class FileUploadBuilder extends KnowledgeGraphQueryBuilder {
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

class ZipFileUploadBuilder extends KnowledgeGraphQueryBuilder {
    private _filename: string = null
    private _id: number = null;

    filename(name: string): ZipFileUploadBuilder {
        this._filename = name
        return this;
    }

    id(id: number): ZipFileUploadBuilder {
        this._id = id;
        return this;
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/zipUpload`
        if (this._id) {
            this.url.pathname += `/${this._id}`;
        }
        if (this._filename) {
            this.url.pathname += `/${this._filename}`
        }
        return super.build()
    }
}

class UploadBuilder extends KnowledgeGraphQueryBuilder {
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

class FindOneBuilder extends KnowledgeGraphQueryBuilder {
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

class FindAllBuilder extends KnowledgeGraphQueryBuilder {
    protected _imageIDs: number[] = [];

    imageIDs(ids: number[]): FindAllBuilder {
        this._imageIDs = ids
        return this
    }

    build(): string {
        this._imageIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_IDS, id.toString());
        })

        return super.build();
    }
}

class FindByTaxonIDsBuilder extends KnowledgeGraphQueryBuilder {
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
            this.url.searchParams.append(Q_PARAM_IDS, id.toString());
        })

        return super.build();
    }
}

