import { Module } from '@nestjs/common';
import { DwCService } from './dwc/dwc.service';
import { DwCController } from './dwc/dwc.controller';
import { StorageModule } from '@symbiota2/api-storage';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';
import { AppConfigModule } from '@symbiota2/api-config';
import { DatabaseModule } from '@symbiota2/api-database';
import { DwcGenerateQueue } from './dwc/queues/dwc-generate.queue';
import { DwcGenerateProcessor } from './dwc/queues/dwc-generate.processor';
import { UserModule } from '@symbiota2/api-auth';

@Module({
    imports: [AppConfigModule, DatabaseModule, StorageModule, DwcGenerateQueue, UserModule],
    controllers: [DwCController],
    providers: [DwCService, DwcGenerateProcessor],
    exports: [DwCService]
})
export class DwCModule extends SymbiotaApiPlugin { }
