import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppConfigModule } from '@symbiota2/api-config';
import {DatabaseProvider} from './database.provider';
import { entityProviders } from './providers';
import * as entities from './entities';
import * as migrations from './migrations';
import { ApiPluginModule } from '@symbiota2/api-common';

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
            migrations: Object.values(migrations) as any[]
        }),
        ...entityProviders
    ],
    exports: entityProviders
})
export class DatabaseModule implements OnApplicationBootstrap {
    onApplicationBootstrap() {

    }
}
