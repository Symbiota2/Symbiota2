import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { DatabaseModule } from '@symbiota2/api-database';
import { GeographyController } from './geography.controller';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';

@Module({
    imports: [DatabaseModule],
    controllers: [GeographyController],
    providers: [
        CountryService
    ],
    exports: [
        CountryService
    ]
})
export class GeographyModule extends SymbiotaApiPlugin { }
