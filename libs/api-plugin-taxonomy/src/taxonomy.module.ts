import { Module } from '@nestjs/common'
import { DatabaseModule } from '@symbiota2/api-database'
import { TaxonService } from './taxon/taxon.service'
import { TaxonController } from './taxon/taxon.controller'
import {TaxonomicAuthorityService} from "./taxonomicAuthority/taxonomicAuthority.service"
import {TaxonomicAuthorityController} from "./taxonomicAuthority/taxonomicAuthority.controller"
import {TaxonomicStatusService} from "./taxonomicStatus/taxonomicStatus.service"
import {TaxonomicStatusController} from "./taxonomicStatus/taxonomicStatus.controller"
import {TaxonDescriptionBlockController} from "./taxonDescriptionBlock/taxonDescriptionBlock.controller"
import { SymbiotaApiPlugin } from '@symbiota2/api-common'
import { TaxonomicEnumTreeService } from './taxonomicEnumTree/taxonomicEnumTree.service'
import { TaxonomicEnumTreeController } from './taxonomicEnumTree/taxonomicEnumTree.controller'
import { TaxonVernacularService } from './taxonVernacular/taxonVernacular.service'
import { TaxonVernacularController } from './taxonVernacular/taxonVernacular.controller'
import { TaxonDescriptionBlockService } from './taxonDescriptionBlock/taxonDescriptionBlock.service';
import { TaxonResourceLinkService } from './taxonResourceLink/taxonResourceLink.service';
import { TaxonResourceLinkController } from './taxonResourceLink/taxonResourceLink.controller';
import { TaxonDescriptionStatementController } from './taxonDescriptionStatement/taxonDescriptionStatement.controller';
import { TaxonDescriptionStatementService } from './taxonDescriptionStatement/taxonDescriptionStatement.service';
import { TaxonLinkService } from './taxonLink/taxonLink.service';
import { TaxonLinkController } from './taxonLink/taxonLink.controller';
import { TaxonProfilePublicationImageLinkController } from './taxonProfilePublicationImageLink/taxonProfilePublicationImageLink.controller';
import { TaxonProfilePublicationImageLinkService } from './taxonProfilePublicationImageLink/taxonProfilePublicationImageLink.service';
import { TaxonProfilePublicationDescriptionLinkController } from './taxonProfilePublicationDescriptionLink/taxonProfilePublicationDescriptionLink.controller';
import { TaxonProfilePublicationDescriptionLinkService } from './taxonProfilePublicationDescriptionLink/taxonProfilePublicationDescriptionLink.service';
import { TaxonProfilePublicationService } from './taxonProfilePublication/taxonProfilePublication.service';
import { TaxonProfilePublicationController } from './taxonProfilePublication/taxonProfilePublication.controller';

@Module({
    imports: [DatabaseModule],
    providers: [
        TaxonService,
        TaxonVernacularService,
        TaxonomicAuthorityService,
        TaxonomicStatusService,
        TaxonomicEnumTreeService,
        TaxonDescriptionBlockService,
        TaxonDescriptionStatementService,
        TaxonLinkService,
        TaxonProfilePublicationService,
        TaxonProfilePublicationImageLinkService,
        TaxonProfilePublicationDescriptionLinkService,
        TaxonResourceLinkService
    ],
    controllers: [
        TaxonController,
        TaxonVernacularController,
        TaxonomicAuthorityController,
        TaxonomicStatusController,
        TaxonomicEnumTreeController,
        TaxonDescriptionBlockController,
        TaxonDescriptionStatementController,
        TaxonLinkController,
        TaxonProfilePublicationController,
        TaxonProfilePublicationImageLinkController,
        TaxonProfilePublicationDescriptionLinkController,
        TaxonResourceLinkController
    ],
    exports: [
        TaxonService,
        TaxonVernacularService,
        TaxonomicAuthorityService,
        TaxonomicStatusService,
        TaxonomicEnumTreeService,
        TaxonDescriptionBlockService,
        TaxonDescriptionStatementService,
        TaxonLinkService,
        TaxonProfilePublicationService,
        TaxonProfilePublicationImageLinkService,
        TaxonProfilePublicationDescriptionLinkService,
        TaxonResourceLinkService
    ]
})
export class TaxonomyModule extends SymbiotaApiPlugin {}
