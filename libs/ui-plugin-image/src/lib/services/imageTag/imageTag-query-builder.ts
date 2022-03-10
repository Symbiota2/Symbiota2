import { Q_PARAM_IDS, Q_PARAM_IMAGEIDS, Q_PARAM_LIMIT, Q_PARAM_OFFSET } from '../../../constants';
import { ImageQueryBuilder } from '../image/image-query-builder';

export class ImageTagQueryBuilder {
    protected baseUrl: string
    protected url: URL

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/imageTag`)
    }

    findAll(): FindAllBuilder {
        return new FindAllBuilder(this.baseUrl)
    }

    findOne(): FindOneBuilder {
        return new FindOneBuilder(this.baseUrl)
    }

    delete(): DeleteOneBuilder {
        return new DeleteOneBuilder(this.baseUrl);
    }

    build(): string {
        return this.url.toString()
    }
}

class FindOneBuilder extends ImageTagQueryBuilder {
    protected _id: number = null

    id(id: number): FindOneBuilder {
        this._id = id
        return this
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/${this._id}`;
        return super.build()
    }
}

class FindAllBuilder extends ImageTagQueryBuilder {
    protected _ids: number[] = []
    protected _imageIds: number[] = []
    protected _limit : string
    protected _offset : string

    ids(ids: number[]): FindAllBuilder {
        this._ids = ids
        return this
    }

    imageIds(ids: number[]): FindAllBuilder {
        this._imageIds = ids
        return this
    }

    limit(number: number): FindAllBuilder {
        this._limit = number.toString()
        return this
    }

    offset(number: number): FindAllBuilder {
        this._limit = number.toString()
        return this
    }

    build(): string {
        if (this._limit) {
            this.url.searchParams.append(Q_PARAM_LIMIT, this._limit)
        }
        if (this._offset) {
            this.url.searchParams.append(Q_PARAM_OFFSET, this._offset)
        }
        this._ids.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_IDS, id.toString());
        })
        this._imageIds.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_IMAGEIDS, id.toString());
        })
        return super.build();
    }

}

class DeleteOneBuilder extends ImageTagQueryBuilder {
    protected _id: number

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
