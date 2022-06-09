import { Q_PARAM_NAME} from '../../../constants';
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

    findByName(): FindByNameBuilder {
        return new FindByNameBuilder(this.baseUrl)
    }

    download(): DownloadBuilder {
        return new DownloadBuilder(this.baseUrl)
    }

    create(): CreateOneBuilder {
        return new CreateOneBuilder(this.baseUrl);
    }

    delete(): DeleteOneBuilder {
        return new DeleteOneBuilder(this.baseUrl);
    }

    build(): string {
        return this.url.toString()
    }
}

class CreateOneBuilder extends KnowledgeGraphQueryBuilder {
    protected _name: string

    name(name: string): CreateOneBuilder {
        this._name = name
        return this
    }

    build(): string {
        if (this._name) {
            // this.url.searchParams.append(Q_PARAM_NAME, this._name);
            this.url.pathname += `/${this._name}`
        }

        return super.build();
    }
}

// Can delete by image id or by taxonid but not both!
class DeleteOneBuilder extends KnowledgeGraphQueryBuilder {
    protected _name: string

    name(name: string): DeleteOneBuilder {
        this._name = name
        return this
    }

    build(): string {
        if (this._name) {
            //this.url.searchParams.append(Q_PARAM_NAME, this._name);
            this.url.pathname += `/${this._name}`
        }

        return super.build()
    }
}

class DownloadBuilder extends KnowledgeGraphQueryBuilder {
    protected _name: string

    name(name: string): DownloadBuilder {
        this._name = name
        return this
    }
    build(): string {
        if (this._name) {
            //this.url.searchParams.append(Q_PARAM_NAME, this._name);
            this.url.pathname += `/${this._name}`
        }
        return super.build()
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

    build(): string {
        return super.build();
    }
}

class FindByNameBuilder extends KnowledgeGraphQueryBuilder {
    protected _name: string

    constructor(apiBaseUrl: string) {
        super(apiBaseUrl)
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}`)
    }

    name(name: string): FindByNameBuilder {
        this._name = name
        return this
    }

    build(): string {
        if (this._name) {
            this.url.searchParams.append(Q_PARAM_NAME, this._name);
        }

        return super.build();
    }
}

