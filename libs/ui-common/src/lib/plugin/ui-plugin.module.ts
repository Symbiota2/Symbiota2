import { ModuleWithProviders, NgModule } from "@angular/core";
import { SymbiotaUiPlugin } from "./symbiota-ui-plugin.class";
import { PluginService } from "./plugin.service";
import { Router } from "@angular/router";

function pluginServiceFactory(plugins: typeof SymbiotaUiPlugin[], router: Router) {
    const pluginSvc = new PluginService(router);
    plugins.forEach((plugin) => {
        plugin.routes().forEach((route) => pluginSvc.putRoute(route));
        plugin.navBarLinks().forEach((link) => pluginSvc.putNavBarLink(plugin.PLUGIN_NAME, link));
        plugin.userProfileTabs().forEach((tab) => pluginSvc.putProfileTab(plugin.PLUGIN_NAME, tab));
    });
    return pluginSvc;
}

@NgModule()
export class UiPluginModule {
    static configure(plugins: typeof SymbiotaUiPlugin[]): ModuleWithProviders<UiPluginModule> {
        return {
            ngModule: UiPluginModule,
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
