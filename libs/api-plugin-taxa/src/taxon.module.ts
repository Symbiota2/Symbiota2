import { Module } from '@nestjs/common';
import { DatabaseModule } from '@symbiota2/api-database';
import { TaxonService } from './taxon/taxon.service';
import { TaxonController } from './taxon/taxon.controller';
import {TaxonomicAuthorityService} from "./taxonomicAuthority/taxonomicAuthority.service";
import {TaxonomicAuthorityController} from "./taxonomicAuthority/taxonomicAuthority.controller";
import {TaxonomicStatusService} from "./taxonomicStatus/taxonomicStatus.service";
import {TaxonomicStatusController} from "./taxonomicStatus/taxonomicStatus.controller";
import { SymbiotaApiPlugin } from '@symbiota2/api-common';
import { TaxonomicEnumTreeService } from './taxonomicEnumTree/taxonomicEnumTree.service';
import { TaxonomicEnumTreeController } from './taxonomicEnumTree/taxonomicEnumTree.controller';
import { TaxonVernacularService } from './taxonVernacular/taxonVernacular.service';
import { TaxonVernacularController } from './taxonVernacular/taxonVernacular.controller';


@Module({
    imports: [DatabaseModule],
    providers: [TaxonService, TaxonVernacularService, TaxonomicAuthorityService, TaxonomicStatusService, TaxonomicEnumTreeService],
    controllers: [TaxonController, TaxonVernacularController, TaxonomicAuthorityController, TaxonomicStatusController, TaxonomicEnumTreeController],
    exports: [TaxonService, TaxonVernacularService, TaxonomicAuthorityService, TaxonomicStatusService, TaxonomicEnumTreeService]
})
export class TaxonModule extends SymbiotaApiPlugin {}
