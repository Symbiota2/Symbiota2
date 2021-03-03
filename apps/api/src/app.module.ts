import { Module } from '@nestjs/common';
import { AppConfigModule } from '@symbiota2/api-config';
import { DatabaseModule } from '@symbiota2/api-database';
import { LanguageModule } from './language/language.module';
import { UserModule, AuthModule } from '@symbiota2/api-auth';
import { PluginModule } from './plugin/plugin.module';

@Module({
    imports: [
        AppConfigModule,
        DatabaseModule,
        LanguageModule,
        UserModule,
        AuthModule,
        PluginModule
    ]
})
export class AppModule {}
