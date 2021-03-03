import { ModuleWithProviders, NgModule } from "@angular/core";
import { SymbiotaPlugin } from "./symbiota-plugin.class";
import { PluginService } from "./plugin.service";
import { Router } from "@angular/router";

function pluginServiceFactory(plugins: typeof SymbiotaPlugin[], router: Router) {
    const pluginSvc = new PluginService(router);
    plugins.forEach((plugin) => {
        plugin.getRoutes().forEach((route) => pluginSvc.putRoute(route));
        plugin.getNavBarLinks().forEach((link) => pluginSvc.putNavBarLink(link));
        plugin.getUserProfileTabs().forEach((tab) => pluginSvc.putProfileTab(tab));
    });
    return pluginSvc;
}

@NgModule()
export class PluginModule {
    static configure(plugins: typeof SymbiotaPlugin[]): ModuleWithProviders<PluginModule> {
        return {
            ngModule: PluginModule,
            providers: [{
                provide: PluginService,
                useFactory: (router: Router) => {
                    return pluginServiceFactory(plugins, router);
                },
                deps: [Router]
            }]
        };
    }
}
