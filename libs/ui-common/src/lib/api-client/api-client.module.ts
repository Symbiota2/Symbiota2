import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AlertModule } from "../alert";


@NgModule({
    imports: [
        AlertModule,
        HttpClientModule
    ],
    exports: [
        HttpClientModule
    ]
})
export class ApiClientModule { }
