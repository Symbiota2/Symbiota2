import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { ConfigModule } from '@nestjs/config';
import configBuilder from './configuration';

@Module({
    imports: [
        ConfigModule.forRoot({ load: [configBuilder] })
    ],
    providers: [AppConfigService],
    exports: [AppConfigService]
})
export class AppConfigModule {}
