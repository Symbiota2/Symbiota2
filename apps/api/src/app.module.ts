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
import { DatabaseModule } from '@symbiota2/api-database';
import { DwCModule } from '@symbiota2/api-dwc';
import { KnowledgeGraphModule } from '../../../libs/api-knowledge-graph/src/lib/knowledge-graph.module';
import { ChecklistModule } from '@symbiota2/api-plugin-checklist';
import { I18nModule } from '@symbiota2/api-plugin-i18n'


const ENABLED_PLUGINS = [
    CollectionModule,
    OccurrenceModule,
    GeographyModule,
    ImageModule,
    TaxonomyModule,
    ChecklistModule,
    DwCModule,
    KnowledgeGraphModule,
    CollectionModule,
    I18nModule,
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
            imports: [AppConfigModule, DatabaseModule]
        }),
        ApiPluginModule.configure(ENABLED_PLUGINS)
    ]
})
export class AppModule {}
