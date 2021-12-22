import { Module } from '@nestjs/common';
import { DatabaseModule } from '@symbiota2/api-database';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';
import { StorageModule } from '@symbiota2/api-storage';

@Module({
    imports: [DatabaseModule,StorageModule],
    providers: [ImageService],
    controllers: [ImageController],
    exports: [ImageService]
})
export class ImageModule extends SymbiotaApiPlugin {}
