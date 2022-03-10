import { Module } from '@nestjs/common';
import { StorageModule } from '@symbiota2/api-storage';
import { SymbiotaApiPlugin } from '@symbiota2/api-common';
import { AppConfigModule } from '@symbiota2/api-config';
import { DatabaseModule } from '@symbiota2/api-database';
import { UserModule } from '@symbiota2/api-auth';
import { KnowledgeGraphController } from './knowledge-graph/knowledge-graph.controller';
import { KnowledgeGraphService } from './knowledge-graph/knowledge-graph.service';
import { KnowledgeGraphGenerateProcessor } from './knowledge-graph/queues/knowledge-graph-generate.processor';
import { KnowledgeGraphGenerateQueue } from './knowledge-graph/queues/knowledge-graph-generate.queue';

@Module({
    imports: [AppConfigModule, DatabaseModule, StorageModule, KnowledgeGraphGenerateQueue, UserModule],
    controllers: [KnowledgeGraphController],
    providers: [KnowledgeGraphService, KnowledgeGraphGenerateProcessor],
    exports: [KnowledgeGraphService]
})
export class KnowledgeGraphModule extends SymbiotaApiPlugin { }
