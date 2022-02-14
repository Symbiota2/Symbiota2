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
    collectionID: number;
    publish: boolean;
}

@Processor(QUEUE_ID_GENERATE_KNOWLEDGE_GRAPH)
export class KnowledgeGraphGenerateProcessor {
    private readonly logger = new Logger(KnowledgeGraphGenerateProcessor.name);

    constructor(
        private readonly dwc: KnowledgeGraphService,
        private readonly notifications: NotificationService) { }

    @Process()
    async generateKGForCollection(job: Job<KnowledgeGraphGenerateJob>) {
        this.logger.debug(
            `Generating knowledge graph for collectionID ${job.data.collectionID}...`
        );
        await this.dwc.createGraphForCollection(
            job.data.collectionID,
            { publish: job.data.publish }
        );
    }

    @OnQueueCompleted()
    async onKGGenerated(job: Job<KnowledgeGraphGenerateJob>) {
        const message = `Knowledge graph generation complete for collectionID ${job.data.collectionID}`;
        this.logger.debug(message);
        await this.notifications.add(job.data.userID, message);
    }

    @OnQueueFailed()
    async onKGGenerateFailed(job: Job<KnowledgeGraphGenerateJob>, err: Error) {
        const message = `Failed to generate knowledge graph for collectionID ${job.data.collectionID}`;
        this.logger.error(message);
        this.logger.error(JSON.stringify(err));

        await this.notifications.add(
            job.data.userID,
            `${message}: ${JSON.stringify(err)}`
        );
    }
}
