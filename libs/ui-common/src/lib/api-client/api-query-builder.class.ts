import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { response } from 'express';



export class ApiQueryBuilder<T> {
    private readonly url: string;
    private method: "GET" | "PUT" | "PATCH" | "POST" | "DELETE" | "HEAD";
    private _body: T = null;
    private responseType: "json" | "arraybuffer" | "blob" | "text" = "json";

    private withCredentials = false;
    private headers = new HttpHeaders({
        "Content-Type": "application/json; charset=utf-8"
    });
    private queryParams: HttpParams = new HttpParams();

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

    head(): ApiQueryBuilder<T> {
        this.method = "HEAD";
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

    setResponseType(responseType: "json" | "arraybuffer" | "blob" | "text"){
        this.responseType = responseType;
        return this;
    }

    queryParam(key: string, value: unknown): ApiQueryBuilder<T> {
        this.queryParams = this.queryParams.append(key, value.toString());
        return this;
    }

    fileUpload(): ApiQueryBuilder<T> {
        this.method = "POST";
        this.headers = this.headers.delete('Content-Type');
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

    header(key: string, value: string | string[]): ApiQueryBuilder<T> {
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
                responseType: this.responseType,
                params: this.queryParams
            }
        );
    }
}
