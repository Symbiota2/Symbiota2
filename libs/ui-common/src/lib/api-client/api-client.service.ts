import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { AppConfigService } from '../app-config';
import { ApiQueryBuilder } from './api-query-builder.class';
import { Observable } from 'rxjs';
import { filter, finalize, map } from 'rxjs/operators';
import { ApiClientModule } from './api-client.module';
import { LoadingService } from '../alert';

interface SendOpts {
    skipLoading?: boolean;
}

@Injectable({
    providedIn: ApiClientModule
})
export class ApiClientService {
    constructor(
        private readonly appConfig: AppConfigService,
        private readonly http: HttpClient,
        private readonly loading: LoadingService) { }

    apiRoot(): string {
        return this.appConfig.apiUri();
    }

    queryBuilder<T>(url: string): ApiQueryBuilder<T> {
        return new ApiQueryBuilder(url);
    }

    send<RequestType, ResponseType>(query: HttpRequest<RequestType>, opts?: SendOpts): Observable<ResponseType> {
        const skipLoading = opts && opts.skipLoading === true;

        if (!skipLoading) {
            this.loading.start()
        }
        return this.http.request<ResponseType>(query).pipe(
            filter((httpEvent) => httpEvent.type === HttpEventType.Response),
            map((httpResponse) => (httpResponse as HttpResponse<ResponseType>).body),
            finalize(() => {
                if (!skipLoading) {
                    this.loading.end()
                }
            })
        );
    }
}
