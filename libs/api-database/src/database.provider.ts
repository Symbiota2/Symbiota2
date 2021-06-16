import {
    Connection,
    createConnection,
    EntityTarget,
} from 'typeorm';
import { AppConfigService } from '@symbiota2/api-config';
import {Provider} from '@nestjs/common';

/**
 * NestJS ID for the database provider
 */
export const DATABASE_PROVIDER_ID = 'DATABASE_CONNECTION';

/**
 * Options that TypeORM expects when connecting to the database
 */
export interface DatabaseProviderOptions {
    entities: Array<string | EntityTarget<any>>;
}

/**
 * Factory for creating a TypeORM database connection
 * @param appConfig The AppConfigService for the API
 * @param providerOptions Entities and migrations to be loaded by TypeORM
 */
async function databaseConnectionFactory(
    appConfig: AppConfigService,
    providerOptions: DatabaseProviderOptions): Promise<Connection> {

    // logger.debug(`Loading entities from ${providerOptions.entities}...`);
    // logger.debug(`Loading migrations from ${providerOptions.migrations}...`);

    const opts = Object.assign({}, appConfig.databaseConfiguration(), providerOptions);
    return createConnection(opts);
}

/**
 * Provides an injectable typeorm connection
 */
export class DatabaseProvider {
    /**
     * Should always be called when the provider is imported into
     * database.module.ts. Loads the provided entities and migrations.
     * @param providerOptions Entities and migrations that TypeORM should
     * use
     * @return Connection A TypeORM database connection
     */
    static register(providerOptions: DatabaseProviderOptions): Provider<Promise<Connection>> {
        return {
            provide: DATABASE_PROVIDER_ID,
            useFactory: (appConfig) => {
                return databaseConnectionFactory(appConfig, providerOptions)
            },
            inject: [AppConfigService]
        };
    }
}
