import { Module } from '@nestjs/common'
import { DatabaseModule } from '@symbiota2/api-database'
import { TaxonProfilePublicationImageLinkService } from './taxonProfilePublicationImageLink.service'
import { TaxonProfilePublicationImageLinkController } from './taxonProfilePublicationImageLink.controller'
import { SymbiotaApiPlugin } from '@symbiota2/api-common'

@Module({
    imports: [DatabaseModule],
    providers: [TaxonProfilePublicationImageLinkService],
    controllers: [TaxonProfilePublicationImageLinkController],
    exports: [TaxonProfilePublicationImageLinkService]
})
export class TaxonProfilePublicationImageLinkModule extends SymbiotaApiPlugin {}
