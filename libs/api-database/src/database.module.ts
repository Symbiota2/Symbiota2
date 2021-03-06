import { Module } from '@nestjs/common';
import { AppConfigModule } from '@symbiota2/api-config';
import {DatabaseProvider} from './database.provider';
import { entityProviders } from './providers';
import * as entities from './entities';
import { ApiPluginModule } from '@symbiota2/api-common';

/**
 * Module that imports TypeORM into the API and provides utilities for
 * manipulating the database
 */
@Module({
    imports: [
        AppConfigModule,
        // Import this so that it's registered before the DatabaseModule
        ApiPluginModule
    ],
    providers: [
        DatabaseProvider.register({
            entities: [
                ...Object.values(entities),
                // And then we can pull entities from it
                ...ApiPluginModule.entities()
            ],
        }),
        ...entityProviders
    ],
    exports: entityProviders
})
export class DatabaseModule { }
