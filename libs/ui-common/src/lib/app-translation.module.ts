import { NgModule } from '@angular/core';
import {
    TranslateLoader,
    TranslateModule, TranslateService,
    TranslateStore
} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppConfigService } from './app-config';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

/**
 * Module for implementing @ngx-translate, providing i18n for the UI
 */
@NgModule({
    imports: [
        HttpClientModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        { provide: TranslateStore, useClass: TranslateStore }
    ],
    exports: [
        TranslateModule
    ],
    declarations: []
})
export class AppTranslationModule {
    constructor(
        private readonly appConfig: AppConfigService,
        private readonly translate: TranslateService) {

        translate.setDefaultLang(appConfig.defaultLanguage());
        translate.use(translate.getBrowserLang());
    }
}
