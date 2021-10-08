import { Module } from '@nestjs/common';
import { DwCService } from './dwc/dwc.service';
import { DwCController } from './dwc/dwc.controller';
import { StorageModule } from '@symbiota2/api-storage';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';
import { AppConfigModule } from '@symbiota2/api-config';
import { DatabaseModule } from '@symbiota2/api-database';

@Module({
    imports: [AppConfigModule, DatabaseModule, StorageModule],
    controllers: [DwCController],
    providers: [DwCService],
    exports: [DwCService]
})
export class DwCModule extends SymbiotaApiPlugin { }
