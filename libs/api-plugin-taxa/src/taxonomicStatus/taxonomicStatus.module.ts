import { Module } from '@nestjs/common';
import { DatabaseModule } from '@symbiota2/api-database';
import { TaxonomicStatusService } from './taxonomicStatus.service';
import { TaxonomicStatusController } from './taxonomicStatus.controller';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';

@Module({
    imports: [DatabaseModule],
    providers: [TaxonomicStatusService],
    controllers: [TaxonomicStatusController],
    exports: [TaxonomicStatusService]
})
export class TaxonomicStatusModule extends SymbiotaApiPlugin {}
