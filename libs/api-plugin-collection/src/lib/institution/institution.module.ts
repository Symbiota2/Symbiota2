import { Module } from '@nestjs/common';
import { DatabaseModule } from '@symbiota2/api-database';
import { InstitutionService } from './institution.service';
import { InstitutionController } from './institution.controller';
import { AuthModule } from '@symbiota2/api-auth';
import { AppConfigModule } from '@symbiota2/api-config';

/**
 * Module for retrieving institutional owners of specimen collections from
 * the database
 */
@Module({
    imports: [
        AppConfigModule,
        AuthModule,
        DatabaseModule
    ],
    providers: [InstitutionService],
    exports: [InstitutionService],
    controllers: [InstitutionController]
})
export class InstitutionModule { }
