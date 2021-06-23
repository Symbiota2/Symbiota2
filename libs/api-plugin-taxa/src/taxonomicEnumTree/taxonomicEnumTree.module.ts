import { Module } from '@nestjs/common';
import { DatabaseModule } from '@symbiota2/api-database';
import { TaxonomicEnumTreeService } from './taxonomicEnumTree.service';
import { TaxonomicEnumTreeController } from './taxonomicEnumTree.controller';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';

@Module({
    imports: [DatabaseModule],
    providers: [TaxonomicEnumTreeService],
    controllers: [TaxonomicEnumTreeController],
    exports: [TaxonomicEnumTreeService]
})
export class TaxonomicEnumTreeModule extends SymbiotaApiPlugin {}
