import { Module } from '@nestjs/common';
import { DatabaseModule } from '@symbiota2/api-database';
import { TaxonomicAuthorityService } from './taxonomicAuthority.service';
import { TaxonomicAuthorityController } from './taxonomicAuthority.controller';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';

@Module({
    imports: [DatabaseModule],
    providers: [TaxonomicAuthorityService],
    controllers: [TaxonomicAuthorityController],
    exports: [TaxonomicAuthorityService]
})
export class TaxonomicAuthorityModule extends SymbiotaApiPlugin {}
