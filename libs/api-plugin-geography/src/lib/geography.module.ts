import { Module } from '@nestjs/common';
import { CountryService } from './country/country.service';
import { DatabaseModule } from '@symbiota2/api-database';
import { GeographyController } from './geography.controller';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';
import { ContinentService } from './continent/continent.service';

@Module({
    imports: [DatabaseModule],
    controllers: [GeographyController],
    providers: [
        CountryService,
        ContinentService
    ],
    exports: [
        CountryService,
        ContinentService
    ]
})
export class GeographyModule extends SymbiotaApiPlugin { }
