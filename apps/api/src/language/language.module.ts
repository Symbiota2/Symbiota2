import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { DatabaseModule } from '@symbiota2/api-database';

@Module({
    imports: [DatabaseModule],
    providers: [LanguageService],
    controllers: [LanguageController]
})
export class LanguageModule {
}
