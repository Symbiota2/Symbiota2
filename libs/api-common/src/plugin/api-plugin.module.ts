import { DynamicModule, Module } from '@nestjs/common';
import { SymbiotaApiPlugin } from './symbiota-api-plugin';
import { EntityTarget } from 'typeorm';

/**
 * Module responsible for loading plugins into the API core.
 */
@Module({})
export class ApiPluginModule {
    private static _entities: EntityTarget<any>[] = [];

    /**
     * Called when the module is imported into NestJS
     * @param plugins A list of plugins that should be loaded into the API core
     */
    static configure(plugins: Array<typeof SymbiotaApiPlugin>): DynamicModule {
        plugins.forEach((p) => this._entities.push(...p.entities()));
        return {
            module: ApiPluginModule,
            imports: plugins as never[],
            exports: plugins
        };
    }

    /**
     * List of any entities provided by plugins
     */
    static entities(): EntityTarget<any>[] {
        return this._entities;
    }
}
