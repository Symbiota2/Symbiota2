import { Q_PARAM_COLLID } from '../../constants';
import { ApiOccurrenceFindAllParams } from '@symbiota2/data-access';
import { HttpParams } from '@angular/common/http';

export class OccurrenceQueryBuilder {
    protected baseUrl: string;
    protected url: URL;

    constructor(apiBaseUrl: string) {
        this.baseUrl = apiBaseUrl;
        this.url = new URL(`${apiBaseUrl}/occurrences`);
    }

    findAll(): FindAllBuilder {
        return new FindAllBuilder(this.baseUrl);
    }

    findOne(): FindOneBuilder {
        return new FindOneBuilder(this.baseUrl);
    }

    create(): CreateOneBuilder {
        return new CreateOneBuilder(this.baseUrl);
    }

    upload(): UploadBuilder {
        return new UploadBuilder(this.baseUrl);
    }

    build(): string {
        return this.url.toString();
    }
}

class CreateOneBuilder extends OccurrenceQueryBuilder {
    protected _collectionID: number;

    collectionID(id: number): CreateOneBuilder {
        this._collectionID = id;
        return this;
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/${this._collectionID}`;
        return super.build();
    }
}

class UploadBuilder extends OccurrenceQueryBuilder {
    protected _collectionID: number;

    collectionID(id: number): UploadBuilder {
        this._collectionID = id;
        return this;
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/${this._collectionID}/upload`;
        return super.build();
    }
}

class FindOneBuilder extends OccurrenceQueryBuilder {
    protected occID: number = null;

    id(id: number): FindOneBuilder {
        this.occID = id;
        return this;
    }

    build(): string {
        this.url.pathname = `${this.url.pathname}/${this.occID}`;
        return super.build();
    }
}

class FindAllBuilder extends OccurrenceQueryBuilder {
    protected _collectionIDs: number[] = [];
    protected queryParams = new HttpParams();

    collectionIDs(ids: number[]): FindAllBuilder {
        this._collectionIDs = ids;
        return this;
    }

    queryParam(key: keyof Omit<ApiOccurrenceFindAllParams, 'collectionID'>, val: unknown): FindAllBuilder {
        const isNull = ['', undefined, null].includes(val as any);
        const isNan = typeof val === 'number' && isNaN(val);

        if (!(isNull || isNan)) {
            this.queryParams = this.queryParams.set(key, val.toString());
        }
        return this;
    }

    build(): string {
        for (const key of this.queryParams.keys()) {
            if (key !== Q_PARAM_COLLID) {
                this.url.searchParams.set(
                    key,
                    this.queryParams.get(key)
                );
            }
        }

        this._collectionIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_COLLID, id.toString());
        });

        return super.build();
    }
}
