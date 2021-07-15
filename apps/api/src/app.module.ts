import { Module } from '@nestjs/common';
import { AppConfigModule, AppConfigService } from '@symbiota2/api-config';
import { UserModule, AuthModule } from '@symbiota2/api-auth';
import { ApiPluginModule } from '@symbiota2/api-common';
import { OccurrenceModule } from '@symbiota2/api-plugin-occurrence';
import { CollectionModule } from '@symbiota2/api-plugin-collection';
import { ImageModule } from '@symbiota2/api-plugin-image'
import { TaxonomyModule } from '@symbiota2/api-plugin-taxonomy'
import { GeographyModule } from '@symbiota2/api-plugin-geography'
import { BullModule } from '@nestjs/bull';

const ENABLED_PLUGINS = [
    CollectionModule,
    OccurrenceModule,
    GeographyModule,
    ImageModule,
    TaxonomyModule
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
        BullModule.forRootAsync({
            useFactory: (appConfig: AppConfigService) => ({
                redis: {
                    host: appConfig.redisHost(),
                    port: appConfig.redisPort()
                }
            }),
            inject: [AppConfigService],
            imports: [AppConfigModule]
        }),
        ApiPluginModule.configure(ENABLED_PLUGINS)
    ]
})
export class AppModule {}
