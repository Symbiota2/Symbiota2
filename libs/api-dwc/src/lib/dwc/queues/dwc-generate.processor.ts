import {
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor
} from '@nestjs/bull';
import { QUEUE_ID_GENERATE_DWC } from './dwc-generate.queue';
import { Logger } from '@nestjs/common';
import { DwCService } from '../dwc.service';
import { Job } from 'bull';
import { NotificationService } from '@symbiota2/api-auth';

export interface DwcGenerateJob {
    userID: number;
    collectionID: number;
    publish: boolean;
}

@Processor(QUEUE_ID_GENERATE_DWC)
export class DwcGenerateProcessor {
    private readonly logger = new Logger(DwcGenerateProcessor.name);

    constructor(
        private readonly dwc: DwCService,
        private readonly notifications: NotificationService) { }

    @Process()
    async generateDwcForCollection(job: Job<DwcGenerateJob>) {
        this.logger.debug(
            `Generating dwc archive for collectionID ${job.data.collectionID}...`
        );
        await this.dwc.createArchiveForCollection(
            job.data.collectionID,
            { publish: job.data.publish }
        );
    }

    @OnQueueCompleted()
    async onDwcGenerated(job: Job<DwcGenerateJob>) {
        const message = `DwC generation complete for collectionID ${job.data.collectionID}`;
        this.logger.debug(message);
        await this.notifications.add(job.data.userID, message);
    }

    @OnQueueFailed()
    async onDwcGenerateFailed(job: Job<DwcGenerateJob>, err: Error) {
        const message = `Failed to generate dwc archive for collectionID ${job.data.collectionID}`;
        this.logger.error(message);
        this.logger.error(JSON.stringify(err));

        await this.notifications.add(
            job.data.userID,
            `${message}: ${JSON.stringify(err)}`
        );
    }
}
