import { Module } from '@nestjs/common'
import { DatabaseModule } from '@symbiota2/api-database'
import { TaxonProfilePublicationService } from './taxonProfilePublication.service'
import { TaxonProfilePublicationController } from './taxonProfilePublication.controller'
import { SymbiotaApiPlugin } from '@symbiota2/api-common'

@Module({
    imports: [DatabaseModule],
    providers: [TaxonProfilePublicationService],
    controllers: [TaxonProfilePublicationController],
    exports: [TaxonProfilePublicationService]
})
export class TaxonProfilePublicationModule extends SymbiotaApiPlugin {}
