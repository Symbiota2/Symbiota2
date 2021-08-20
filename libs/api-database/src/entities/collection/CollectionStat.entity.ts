import {
    Column,
    Entity,
    JoinColumn,
    OneToOne, Repository
} from 'typeorm';
import { Collection } from './Collection.entity';
import { EntityProvider } from '../../entity-provider.class';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ApiCollectionStatsOutput } from '@symbiota2/data-access';
import { Occurrence } from '../occurrence/Occurrence.entity';

@Entity('omcollectionstats')
export class CollectionStat extends EntityProvider implements ApiCollectionStatsOutput {
    @Column('int', { name: 'collid', primary: true, unsigned: true, width: 10 })
    collectionID: number;

    @Column('int', { name: 'recordcnt', unsigned: true, default: () => '\'0\'' })
    @ApiProperty()
    @Expose()
    recordCount: number;

    @Column('int', { name: 'georefcnt', nullable: true, unsigned: true })
    @ApiProperty()
    @Expose()
    georeferencedCount: number | null;

    @Column('int', { name: 'familycnt', nullable: true, unsigned: true })
    @ApiProperty()
    @Expose()
    familyCount: number | null;

    @Column('int', { name: 'genuscnt', nullable: true, unsigned: true })
    @ApiProperty()
    @Expose()
    genusCount: number | null;

    @Column('int', { name: 'speciescnt', nullable: true, unsigned: true })
    @ApiProperty()
    @Expose()
    speciesCount: number | null;

    @Column('datetime', { name: 'uploaddate', nullable: true })
    uploadDate: Date | null;

    @Column('datetime', { name: 'datelastmodified', nullable: true })
    @ApiProperty()
    @Expose()
    lastModifiedTimestamp: Date | null;

    @Column('varchar', { name: 'uploadedby', nullable: true, length: 45 })
    uploadedBy: string;

    @Column('longtext', { name: 'dynamicProperties', nullable: true })
    dynamicProperties: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToOne(
        () => Collection,
        (omcollections) => omcollections.collectionStats,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'collid', referencedColumnName: 'id' }])
    collection: Promise<Collection>;

    async recalculate(occurrences: Repository<Occurrence>): Promise<void> {
        const [recordCount, speciesCount, familyCount, genusCount, geoRefCount] = await Promise.all([
            occurrences.count({ collectionID: this.collectionID }),
            occurrences.createQueryBuilder('o')
                .select('COUNT(DISTINCT o.scientificName) as cnt')
                .where('o.collectionID = :collectionID', { collectionID: this.collectionID })
                .andWhere('o.family is not null')
                .getRawOne<{ cnt: number }>(),
            occurrences.createQueryBuilder('o')
                .select('COUNT(DISTINCT o.family) as cnt')
                .where('o.collectionID = :collectionID', { collectionID: this.collectionID })
                .andWhere('o.family is not null')
                .getRawOne<{ cnt: number }>(),
            occurrences.createQueryBuilder('o')
                .select('COUNT(DISTINCT o.genus) as cnt')
                .where('o.collectionID = :collectionID', { collectionID: this.collectionID })
                .andWhere('o.genus is not null')
                .getRawOne<{ cnt: number }>(),
            occurrences.createQueryBuilder('o')
                .select('COUNT(*) as cnt')
                .where('o.collectionID = :collectionID', { collectionID: this.collectionID })
                .andWhere('o.latitude is not null')
                .andWhere('o.longitude is not null')
                .getRawOne<{ cnt: number }>(),
        ]);

        this.recordCount = recordCount;
        this.speciesCount = speciesCount.cnt;
        this.familyCount = familyCount.cnt;
        this.genusCount = genusCount.cnt;
        this.georeferencedCount = geoRefCount.cnt;
        this.lastModifiedTimestamp = new Date();
    }
}
