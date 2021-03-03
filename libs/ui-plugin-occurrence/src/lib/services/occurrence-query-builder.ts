import { Q_PARAM_CAT_NUM, Q_PARAM_COLLIDS } from '../../constants';

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

    build(): string {
        return this.url.toString();
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
    protected _catalogNumber: string = null;

    collectionIDs(ids: number[]): FindAllBuilder {
        this._collectionIDs = ids;
        return this;
    }

    catalogNumber(catalogNumber: string): FindAllBuilder {
        this._catalogNumber = catalogNumber;
        return this;
    }

    build(): string {
        this._collectionIDs.forEach((id) => {
            this.url.searchParams.append(Q_PARAM_COLLIDS, id.toString());
        });

        this.url.searchParams.set(
            Q_PARAM_CAT_NUM,
            this._catalogNumber
        );

        return super.build();
    }
}
