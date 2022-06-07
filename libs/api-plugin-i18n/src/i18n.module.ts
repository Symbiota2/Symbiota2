import { Module } from '@nestjs/common'
import { DatabaseModule } from '@symbiota2/api-database'
import { AppConfigModule, AppConfigService } from '@symbiota2/api-config';
import { StorageModule } from '@symbiota2/api-storage';
import { join as pathJoin } from 'path';
import { promises as fsPromises } from 'fs';
import { I18nService } from './i18n/i18n.service';
import { I18nController } from './i18n/i18n.controller';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';

@Module({
    imports: [AppConfigModule,DatabaseModule,
        StorageModule],
    providers: [
        I18nService,
    ],
    controllers: [
        I18nController,
    ],
    exports: [
        I18nService,
    ]
})
export class I18nModule extends SymbiotaApiPlugin {}
