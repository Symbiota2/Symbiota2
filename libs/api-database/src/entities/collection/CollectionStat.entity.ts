import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { Collection } from './Collection.entity';
import { EntityProvider } from '../../entity-provider.class';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ApiCollectionStatsOutput } from '@symbiota2/data-access';

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
}
