import { NgModule } from '@angular/core';
import {
    TranslateLoader,
    TranslateModule, TranslateService,
    TranslateStore
} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppConfigService } from './app-config';
import { Symbiota2ExpansionPanelComponent } from './components';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

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
        TranslateModule,
    ]
})
export class AppTranslationModule {
    constructor(
        private readonly appConfig: AppConfigService,
        private readonly translate: TranslateService) {

        translate.setDefaultLang(appConfig.defaultLanguage());
        translate.use(translate.getBrowserLang());
    }
}
