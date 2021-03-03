import { HttpHeaders, HttpRequest } from '@angular/common/http';

export class ApiQueryBuilder<T> {
    private readonly url: string;
    private method: "GET" | "PUT" | "PATCH" | "POST" | "DELETE";
    private _body: T = null;

    private withCredentials = false;
    private headers: HttpHeaders = new HttpHeaders({
        "Content-Type": "application/json; charset=utf-8"
    });

    constructor(url: string) {
        this.url = url;
    }

    delete(): ApiQueryBuilder<T> {
        this.method = "DELETE";
        return this;
    }

    get(): ApiQueryBuilder<T> {
        this.method = "GET";
        return this;
    }

    patch(): ApiQueryBuilder<T> {
        this.method = "PATCH";
        return this;
    }

    post(): ApiQueryBuilder<T> {
        this.method = "POST";
        return this;
    }

    put(): ApiQueryBuilder<T> {
        this.method = "PUT";
        return this;
    }

    addJwtAuth(accessToken: string): ApiQueryBuilder<T> {
        return this.addCookieAuth().header("Authorization", `Bearer ${accessToken}`);
    }

    addCookieAuth(): ApiQueryBuilder<T> {
        this.withCredentials = true;
        return this;
    }

    body(bodyData: T): ApiQueryBuilder<T> {
        this._body = bodyData;
        return this;
    }

    private header(key: string, value: string | string[]): ApiQueryBuilder<T> {
        this.headers = this.headers.set(key, value);
        return this;
    }

    build(): HttpRequest<T> {
        if (!this.method) {
            throw new Error("Request method is not set");
        }

        return new HttpRequest<T>(
            this.method,
            this.url,
            this._body,
            {
                withCredentials: this.withCredentials,
                headers: this.headers,
                responseType: "json"
            }
        );
    }
}
