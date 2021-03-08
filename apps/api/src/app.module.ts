import { Module } from '@nestjs/common';
import { AppConfigModule } from '@symbiota2/api-config';
import { DatabaseModule } from '@symbiota2/api-database';
import { LanguageModule } from './language/language.module';
import { UserModule, AuthModule } from '@symbiota2/api-auth';
import { ApiPluginModule } from '@symbiota2/api-common';
import { OccurrenceModule } from '@symbiota2/api-plugin-occurrence';
import { CollectionModule } from '@symbiota2/api-plugin-collection';

@Module({
    imports: [
        AppConfigModule,
        DatabaseModule,
        LanguageModule,
        UserModule,
        AuthModule,
        ApiPluginModule.configure([
            CollectionModule,
            OccurrenceModule
        ])
    ]
})
export class AppModule {}
