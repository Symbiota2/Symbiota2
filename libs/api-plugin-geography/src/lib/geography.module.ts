import { Module } from '@nestjs/common';
import { CountryService } from './country/country.service';
import { DatabaseModule } from '@symbiota2/api-database';
import { GeographyController } from './geography.controller';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';
import { ContinentService } from './continent/continent.service';
import { StateProvinceService } from './state-province/state-province.service';

/**
 * Module for retrieving geography data from the database
 */
@Module({
    imports: [DatabaseModule],
    controllers: [GeographyController],
    providers: [
        CountryService,
        ContinentService,
        StateProvinceService
    ],
    exports: [
        CountryService,
        ContinentService,
        StateProvinceService
    ]
})
export class GeographyModule extends SymbiotaApiPlugin { }
