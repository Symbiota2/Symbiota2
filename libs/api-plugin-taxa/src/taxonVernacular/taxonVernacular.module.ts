import { Module } from '@nestjs/common';
import { DatabaseModule } from '@symbiota2/api-database';
import { TaxonVernacularService } from './taxonVernacular.service';
import { TaxonVernacularController } from './taxonVernacular.controller';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';


@Module({
    imports: [DatabaseModule],
    providers: [TaxonVernacularService],
    controllers: [TaxonVernacularController],
    exports: [TaxonVernacularService]
})
export class TaxonVernacularModule extends SymbiotaApiPlugin {}
