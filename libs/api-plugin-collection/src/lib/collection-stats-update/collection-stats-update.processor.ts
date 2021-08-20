import {
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor
} from '@nestjs/bull';
import {
    CollectionStatsUpdateJob,
    QUEUE_ID_COLLECTION_STATS_UPDATE
} from './collection-stats-update.queue';
import { Job } from 'bull';
import {
    CollectionStat,
    Occurrence,
    TaxaEnumTreeEntry,
    Taxon,
    TaxonomicUnit
} from '@symbiota2/api-database';
import { Inject, Logger } from '@nestjs/common';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';

@Processor(QUEUE_ID_COLLECTION_STATS_UPDATE)
export class CollectionStatsUpdateProcessor {
    private static readonly OCCURRENCE_BATCH_SIZE = 1024;
    private readonly logger = new Logger(CollectionStatsUpdateProcessor.name);

    constructor(
        @Inject(Occurrence.PROVIDER_ID) private readonly occurrenceRepo: Repository<Occurrence>,
        @Inject(TaxonomicUnit.PROVIDER_ID) private readonly taxonRanks: Repository<TaxonomicUnit>,
        @Inject(Taxon.PROVIDER_ID) private readonly taxa: Repository<Taxon>,
        @Inject(TaxaEnumTreeEntry.PROVIDER_ID) private readonly taxaEnumTree: Repository<TaxaEnumTreeEntry>,
        @Inject(CollectionStat.PROVIDER_ID) private readonly collectionStats: Repository<CollectionStat>) { }

    @Process()
    async updateCollectionStats(job: Job<CollectionStatsUpdateJob>) {
        let occurrenceUpdates = 0;
        this.logger.log(`Collection stats are being updated for collectionID ${job.data.collectionID}`);

        const [familyRank, genusRank] = await Promise.all([
            this.taxonRanks.findOne(
                { rankName: 'Family' },
                { select: ['rankID'] }
            ),
            this.taxonRanks.findOne(
                { rankName: 'Genus' },
                { select: ['rankID'] }
            ),
        ]);

        let occurrences: Occurrence[] = await this.occurrenceRepo.find({
            where: { collectionID: job.data.collectionID },
            take: CollectionStatsUpdateProcessor.OCCURRENCE_BATCH_SIZE
        });
        let offset = occurrences.length;

        while (occurrences.length > 0) {
            await Promise.all(
                occurrences.map(async (o) => {
                    return await o.populateTaxonomy(
                        this.taxa,
                        familyRank.rankID,
                        genusRank.rankID
                    )
                })
            );
            await this.occurrenceRepo.save(occurrences);
            occurrenceUpdates += occurrences.length;

            let logMsg = 'Taxonomy updated for ';
            logMsg += Intl.NumberFormat().format(occurrenceUpdates) + ' ';
            logMsg += `occurrences in collectionID ${ job.data.collectionID }`;
            this.logger.log(logMsg);

            occurrences = await this.occurrenceRepo.find({
                where: { collectionID: job.data.collectionID },
                take: CollectionStatsUpdateProcessor.OCCURRENCE_BATCH_SIZE,
                skip: offset
            });
            offset += occurrences.length;
        }

        const stats = await this.collectionStats.findOne({ collectionID: job.data.collectionID });
        await stats.recalculate(this.occurrenceRepo);

        await this.collectionStats.save(stats);
    }

    @OnQueueCompleted()
    async queueCompletedHandler(job: Job<CollectionStatsUpdateJob>) {
        this.logger.log(`Collection stats for collectionID ${job.data.collectionID} have been updated`);
    }

    @OnQueueFailed()
    async queueFailedHandler(job: Job<CollectionStatsUpdateJob>, err: Error) {
        this.logger.error(`Collection stats update failed for collectionID ${job.data.collectionID}: ${err.message}`);
        this.logger.error(err.stack);
    }
}
