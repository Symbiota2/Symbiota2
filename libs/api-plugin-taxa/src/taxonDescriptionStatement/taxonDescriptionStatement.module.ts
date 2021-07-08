import { Module } from '@nestjs/common'
import { DatabaseModule } from '@symbiota2/api-database'
import { TaxonDescriptionStatementService } from './taxonDescriptionStatement.service'
import { TaxonDescriptionStatementController } from './taxonDescriptionStatement.controller'
import { SymbiotaApiPlugin } from '@symbiota2/api-common'

@Module({
    imports: [DatabaseModule],
    providers: [TaxonDescriptionStatementService],
    controllers: [TaxonDescriptionStatementController],
    exports: [TaxonDescriptionStatementService]
})
export class TaxonDescriptionStatementModule extends SymbiotaApiPlugin {}
