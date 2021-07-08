import { Module } from '@nestjs/common'
import { DatabaseModule } from '@symbiota2/api-database'
import { TaxonDescriptionBlockService } from './taxonDescriptionBlock.service'
import { TaxonDescriptionBlockController } from './taxonDescriptionBlock.controller'
import { SymbiotaApiPlugin } from '@symbiota2/api-common'

@Module({
    imports: [DatabaseModule],
    providers: [TaxonDescriptionBlockService],
    controllers: [TaxonDescriptionBlockController],
    exports: [TaxonDescriptionBlockService]
})
export class TaxonDescriptionBlockModule extends SymbiotaApiPlugin {}
