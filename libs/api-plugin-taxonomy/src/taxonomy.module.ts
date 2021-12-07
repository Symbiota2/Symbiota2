import { Module } from '@nestjs/common'
import { DatabaseModule } from '@symbiota2/api-database'
import { AppConfigModule, AppConfigService } from '@symbiota2/api-config';
import { TaxonService } from './taxon/taxon.service'
import { TaxonController } from './taxon/taxon.controller'
import {TaxonomicAuthorityService} from "./taxonomicAuthority/taxonomicAuthority.service"
import {TaxonomicAuthorityController} from "./taxonomicAuthority/taxonomicAuthority.controller"
import {TaxonomicUnitService} from "./taxonomicUnit/taxonomicUnit.service"
import {TaxonomicUnitController} from "./taxonomicUnit/taxonomicUnit.controller"
import {TaxonomicStatusService} from "./taxonomicStatus/taxonomicStatus.service"
import {TaxonomicStatusController} from "./taxonomicStatus/taxonomicStatus.controller"
import {TaxonDescriptionBlockController} from "./taxonDescriptionBlock/taxonDescriptionBlock.controller"
import { SymbiotaApiPlugin } from '@symbiota2/api-common';
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
import { MulterModule } from '@nestjs/platform-express';
import { promises as fsPromises } from 'fs';
import { join as pathJoin } from 'path';
import { TaxonomyUploadCleanupQueue } from './queues/taxonomy-upload-cleanup.queue';
import { TaxonomyUploadQueue } from './queues/taxonomy-upload.queue';
import { TaxonomyUploadCleanupProcessor } from './queues/taxonomy-upload-cleanup.processor';
import { TaxonomyUploadProcessor } from './queues/taxonomy-upload.processor';
import { StorageModule } from '@symbiota2/api-storage';

@Module({
    imports: [
        AppConfigModule,
        DatabaseModule,
        MulterModule.registerAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: async (appConfig: AppConfigService) => {
                const uploadDirectory = pathJoin(
                    await appConfig.dataDir(),
                    'uploads',
                    'taxa'
                );

                try {
                    await fsPromises.stat(uploadDirectory);
                }
                catch (e) {
                    await fsPromises.mkdir(
                        uploadDirectory,
                        { mode: 0o700, recursive: true }
                    );
                }

                return {
                    // TODO: Configurable upload limit
                    dest: uploadDirectory,
                    limits: {
                        fileSize: 1074000000 // 1GiB
                    }
                }
            },
        }),
        TaxonomyUploadCleanupQueue,
        TaxonomyUploadQueue,
        StorageModule,
    ],
    providers: [
        TaxonService,
        TaxonVernacularService,
        TaxonomicAuthorityService,
        TaxonomicUnitService,
        TaxonomicStatusService,
        TaxonomicEnumTreeService,
        TaxonDescriptionBlockService,
        TaxonDescriptionStatementService,
        TaxonomyUploadCleanupProcessor,
        TaxonomyUploadProcessor,
        TaxonLinkService,
        TaxonProfilePublicationService,
        TaxonProfilePublicationImageLinkService,
        TaxonProfilePublicationDescriptionLinkService,
        TaxonResourceLinkService,
    ],
    controllers: [
        TaxonController,
        TaxonVernacularController,
        TaxonomicAuthorityController,
        TaxonomicUnitController,
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
        TaxonomicUnitService,
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
export class TaxonomyModule extends SymbiotaApiPlugin {

}
