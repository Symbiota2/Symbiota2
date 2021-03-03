import {
    ModuleWithProviders,
    NgModule,
    Optional,
    SkipSelf
} from '@angular/core';
import { AppEnv } from './AppEnv.class';

@NgModule()
export class AppConfigModule {
    constructor(@Optional() @SkipSelf() parentModule?: AppConfigModule) {
        if (parentModule) {
            let err = `${AppConfigModule.name} is already loaded.`;
            err += 'Import it in the AppModule only';

            throw new Error(err);
        }
    }

    static configure(environ: Record<string, unknown>): ModuleWithProviders<AppConfigModule> {
        return {
            ngModule: AppConfigModule,
            providers: [
                {
                    provide: AppEnv,
                    useValue: new AppEnv(environ)
                }
            ]
        };
    }
}
