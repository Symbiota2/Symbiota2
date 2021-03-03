import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AlertModule } from "../alert";
import { LoadingInterceptor } from './loading.interceptor';


@NgModule({
    imports: [
        AlertModule,
        HttpClientModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true
        }
    ],
    exports: [
        HttpClientModule
    ]
})
export class ApiClientModule { }
