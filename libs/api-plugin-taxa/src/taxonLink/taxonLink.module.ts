import { Module } from '@nestjs/common';
import { DatabaseModule } from '@symbiota2/api-database';
import { TaxonLinkService } from './taxonLink.service';
import { TaxonLinkController } from './taxonLink.controller';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';

@Module({
    imports: [DatabaseModule],
    providers: [TaxonLinkService],
    controllers: [TaxonLinkController],
    exports: [TaxonLinkService]
})
export class TaxonLinkModule extends SymbiotaApiPlugin {}
