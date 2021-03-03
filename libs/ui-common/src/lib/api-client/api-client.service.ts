import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { AppConfigService } from '../app-config';
import { ApiQueryBuilder } from './api-query-builder.class';
import { Observable } from 'rxjs';
import { filter, map } from "rxjs/operators";
import { ApiClientModule } from './api-client.module';

@Injectable({
    providedIn: ApiClientModule
})
export class ApiClientService {
    constructor(
        private readonly appConfig: AppConfigService,
        private readonly http: HttpClient) { }

    apiRoot(): string {
        return this.appConfig.apiUri();
    }

    queryBuilder<T>(url: string): ApiQueryBuilder<T> {
        return new ApiQueryBuilder(url);
    }

    send<RequestType, ResponseType>(query: HttpRequest<RequestType>): Observable<ResponseType> {
        return this.http.request<ResponseType>(query).pipe(
            filter((httpEvent) => httpEvent.type === HttpEventType.Response),
            map((httpResponse) => (httpResponse as HttpResponse<ResponseType>).body)
        );
    }
}
