import { Module } from '@nestjs/common';
import { DatabaseModule } from '@symbiota2/api-database';
import { TaxonResourceLinkService } from './taxonResourceLink.service';
import { TaxonResourceLinkController } from './taxonResourceLink.controller';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';

@Module({
    imports: [DatabaseModule],
    providers: [TaxonResourceLinkService],
    controllers: [TaxonResourceLinkController],
    exports: [TaxonResourceLinkService]
})
export class TaxonResourceLinkModule extends SymbiotaApiPlugin {}
