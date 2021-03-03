import {Module} from '@nestjs/common';
import { AppConfigModule } from '@symbiota2/api-config';
import {DatabaseProvider} from './database.provider';
import { entityProviders } from './providers';
import * as entities from './entities';
import * as migrations from './migrations';

@Module({
    imports: [AppConfigModule],
    providers: [
        DatabaseProvider.register({
            entities: Object.values(entities),
            migrations: Object.values(migrations) as any[]
        }),
        ...entityProviders
    ],
    exports: entityProviders
})
export class DatabaseModule { }
