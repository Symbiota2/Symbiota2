import {
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { NotificationService } from '@symbiota2/api-auth';
import { QUEUE_ID_GENERATE_KNOWLEDGE_GRAPH } from './knowledge-graph-generate.queue';
import { KnowledgeGraphService } from '../knowledge-graph.service';

export interface KnowledgeGraphGenerateJob {
    userID: number;
    graphID: number;
    publish: boolean;
}

@Processor(QUEUE_ID_GENERATE_KNOWLEDGE_GRAPH)
export class KnowledgeGraphGenerateProcessor {
    private readonly logger = new Logger(KnowledgeGraphGenerateProcessor.name);

    constructor(
        private readonly knowledgeGraphService: KnowledgeGraphService,
        private readonly notifications: NotificationService) { }

    @Process()
    async generateKnowledgeGraph(job: Job<KnowledgeGraphGenerateJob>) {
        this.logger.debug(
            `Generating knowledge graph ...`
        );
        await this.knowledgeGraphService.createKnowledgeGraph(
            job.data.graphID,
            { publish: job.data.publish }
        );
    }

    @OnQueueCompleted()
    async onKGGenerated(job: Job<KnowledgeGraphGenerateJob>) {
        const message = `Knowledge graph generation complete `;
        this.logger.debug(message);
        await this.notifications.add(job.data.userID, message);
    }

    @OnQueueFailed()
    async onKGGenerateFailed(job: Job<KnowledgeGraphGenerateJob>, err: Error) {
        const message = `Failed to generate knowledge graph `;
        this.logger.error(message);
        this.logger.error(JSON.stringify(err));

        await this.notifications.add(
            job.data.userID,
            `${message}: ${JSON.stringify(err)}`
        );
    }
}
