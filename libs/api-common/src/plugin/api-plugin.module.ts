import { DynamicModule, Module } from '@nestjs/common';
import { SymbiotaApiPlugin } from './symbiota-api-plugin';
import { EntityTarget } from 'typeorm';

@Module({})
export class ApiPluginModule {
    private static _entities: EntityTarget<any>[] = [];

    static configure(plugins: Array<typeof SymbiotaApiPlugin>): DynamicModule {
        plugins.forEach((p) => this._entities.push(...p.entities()));
        return {
            module: ApiPluginModule,
            imports: plugins as never[],
            exports: plugins
        };
    }

    static entities(): EntityTarget<any>[] {
        return this._entities;
    }
}
