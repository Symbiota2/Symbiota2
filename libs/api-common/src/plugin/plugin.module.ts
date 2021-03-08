import { DynamicModule, Module } from '@nestjs/common';
import { SymbiotaApiPlugin } from './symbiota-api-plugin';

@Module({})
export class PluginModule {
    static register(plugins: Array<typeof SymbiotaApiPlugin>): DynamicModule {
        return {
            module: PluginModule,
            imports: plugins as never[],
            exports: plugins
        };
    }
}
