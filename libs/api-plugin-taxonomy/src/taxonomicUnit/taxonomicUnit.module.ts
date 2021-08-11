import { Module } from '@nestjs/common';
import { DatabaseModule } from '@symbiota2/api-database';
import { TaxonomicUnitService } from './taxonomicUnit.service';
import { TaxonomicUnitController } from './taxonomicUnit.controller';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';

@Module({
    imports: [DatabaseModule],
    providers: [TaxonomicUnitService],
    controllers: [TaxonomicUnitController],
    exports: [TaxonomicUnitService]
})
export class TaxonomicUnitModule extends SymbiotaApiPlugin {}
