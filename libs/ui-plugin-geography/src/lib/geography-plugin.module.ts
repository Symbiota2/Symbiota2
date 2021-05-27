import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    AppConfigModule,
    AppConfigService,
    SymbiotaUiPlugin
} from '@symbiota2/ui-common';
import { GeographyQueryBuilder } from './query-builder';
import { CountryService } from './country.service';
import { ContinentService } from './continent.service';

@NgModule({
    imports: [
        CommonModule,
        AppConfigModule
    ],
    providers: [
        CountryService,
        ContinentService,
        {
            provide: GeographyQueryBuilder,
            useFactory: (uiConfig) => {
                return new GeographyQueryBuilder(uiConfig.apiUri())
            },
            deps: [AppConfigService]
        }
    ]
})
export class GeographyPlugin extends SymbiotaUiPlugin { }
