import { I18N_API_BASE } from '../../routes';
import { Q_PARAM_KEY, Q_PARAM_LANGUAGE, Q_PARAM_TRANSLATABLE, Q_PARAM_VALUE } from '../../../constants';

export class I18nQueryBuilder {
    protected baseUrl: string
    protected namesUrl: URL
    protected nameUrl: URL
    protected url: URL

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl
        this.url = new URL(`${apiBaseUrl}/${I18N_API_BASE}`)
    }

    upload(): UploadBuilder {
        return new UploadBuilder(this.baseUrl);
    }

    build(): string {
        return this.url.toString()
    }
}

class CreateOneBuilder extends I18nQueryBuilder {
    protected _myID: number;

    myID(id: number): CreateOneBuilder {
        this._myID = id
        return this
    }

    build(): string {
        return super.build();
    }
}

class UploadBuilder extends I18nQueryBuilder {
    private _language: string = null
    private _key: string = null
    private _value: string = null
    private _translatable: boolean = false

    language(language: string): UploadBuilder {
        this._language = language;
        return this;
    }

    key(key: string): UploadBuilder {
        this._key = key;
        return this;
    }

    value(value: string): UploadBuilder {
        this._value = value;
        return this;
    }

    translatable(): UploadBuilder {
        this._translatable = true;
        return this;
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}`;
        if (this._language) {
            this.url.searchParams.append(Q_PARAM_LANGUAGE, this._language);
        }
        if (this._key) {
            this.url.searchParams.append(Q_PARAM_KEY, this._key);
        }
        if (this._value) {
            this.url.searchParams.append(Q_PARAM_VALUE, this._value);
        }
        if (this._translatable) {
            this.url.searchParams.append(Q_PARAM_TRANSLATABLE, this._translatable.toString());
        }
        return super.build();
    }
}

