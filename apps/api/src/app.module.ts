import { Module } from '@nestjs/common';
import { AppConfigModule } from '@symbiota2/api-config';
import { UserModule, AuthModule } from '@symbiota2/api-auth';
import { ApiPluginModule } from '@symbiota2/api-common';
import { OccurrenceModule } from '@symbiota2/api-plugin-occurrence';
import { CollectionModule } from '@symbiota2/api-plugin-collection';
import { ApiJobsModule } from '@symbiota2/api-jobs';
import { GeographyModule } from '@symbiota2/api-plugin-geography';

const ENABLED_PLUGINS = [
    ApiJobsModule,
    CollectionModule,
    OccurrenceModule,
    GeographyModule,
];

/**
 * The core module for the API. Imports the AppConfigModule, UserModule, and
 * AuthModule, which can't be disabled. Then uses ApiPluginModule to import
 * plugins.
 */
@Module({
    imports: [
        AppConfigModule,
        UserModule,
        AuthModule,
        ApiPluginModule.configure(ENABLED_PLUGINS)
    ]
})
export class AppModule {}
