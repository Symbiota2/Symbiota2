import { Module } from '@nestjs/common'
import { DatabaseModule } from '@symbiota2/api-database'
import { ImageService } from './image/image.service'
import { ImageController } from './image/image.controller'
import { SymbiotaApiPlugin } from '@symbiota2/api-common'

@Module({
    imports: [DatabaseModule],
    providers: [
        ImageService,
    ],
    controllers: [
        ImageController,
    ],
    exports: [
        ImageService,
    ]
})
export class ImageModule extends SymbiotaApiPlugin {}
