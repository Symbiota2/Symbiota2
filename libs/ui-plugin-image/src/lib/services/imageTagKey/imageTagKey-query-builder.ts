import { Q_PARAM_TAXAIDS } from '../../../constants';

export class ImageTagKeyQueryBuilder {
    protected baseUrl: string
    protected namesUrl: URL
    protected nameUrl: URL
    protected url: URL

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/imageTagKey`)
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

class FindOneBuilder extends ImageTagKeyQueryBuilder {
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

class FindAllBuilder extends ImageTagKeyQueryBuilder {
    protected _imageIDs: number[] = [];

    build(): string {
        this._imageIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_TAXAIDS, id.toString());
        })

        return super.build();
    }

}
