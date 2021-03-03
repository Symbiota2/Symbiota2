import {
    Connection,
    createConnection, EntityTarget, MigrationInterface,
} from 'typeorm';
import { AppConfigService } from '@symbiota2/api-config';
import {Logger, Provider} from '@nestjs/common';

export const DATABASE_PROVIDER_ID = 'DATABASE_CONNECTION';
const logger = new Logger(DATABASE_PROVIDER_ID);

export interface DatabaseProviderOptions {
    entities: Array<string | EntityTarget<any>>;
    migrations: Array<string | MigrationInterface>;
}

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
