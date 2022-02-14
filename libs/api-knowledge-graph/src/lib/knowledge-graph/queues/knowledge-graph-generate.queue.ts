import { BullModule } from '@nestjs/bull';

export const QUEUE_ID_GENERATE_KNOWLEDGE_GRAPH = 'generate-knowledge-graph';
export const KnowledgeGraphGenerateQueue = BullModule.registerQueue({ name: QUEUE_ID_GENERATE_KNOWLEDGE_GRAPH });
