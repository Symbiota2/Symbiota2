import { Module } from '@nestjs/common'
import { DatabaseModule } from '@symbiota2/api-database'
import { TaxonProfilePublicationDescriptionLinkService } from './taxonProfilePublicationDescriptionLink.service'
import { TaxonProfilePublicationDescriptionLinkController } from './taxonProfilePublicationDescriptionLink.controller'
import { SymbiotaApiPlugin } from '@symbiota2/api-common'

@Module({
    imports: [DatabaseModule],
    providers: [TaxonProfilePublicationDescriptionLinkService],
    controllers: [TaxonProfilePublicationDescriptionLinkController],
    exports: [TaxonProfilePublicationDescriptionLinkService]
})
export class TaxonProfilePublicationDescriptionLinkModule extends SymbiotaApiPlugin {}
