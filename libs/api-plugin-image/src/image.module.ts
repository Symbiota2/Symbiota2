import { Module } from '@nestjs/common'
import { DatabaseModule } from '@symbiota2/api-database'
import { AppConfigModule, AppConfigService } from '@symbiota2/api-config';
import { ImageService } from './image/image.service'
import { ImageController } from './image/image.controller'
import { SymbiotaApiPlugin } from '@symbiota2/api-common'
import { ImageTagService } from './imageTag/imageTag.service';
import { ImageTagKeyService } from './imageTagKey/imageTagKey.service';
import { ImageTagKeyController } from './imageTagKey/imageTagKey.controller';
import { ImageTagController } from './imageTag/imageTag.controller';
import { StorageModule } from '@symbiota2/api-storage';

@Module({
    imports: [AppConfigModule,DatabaseModule,StorageModule],
    providers: [
        ImageService,
        ImageTagService,
        ImageTagKeyService,
    ],
    controllers: [
        ImageController,
        ImageTagController,
        ImageTagKeyController,
    ],
    exports: [
        ImageService,
        ImageTagService,
        ImageTagKeyService,
    ]
})
export class ImageModule extends SymbiotaApiPlugin {}
