import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { Collection } from './Collection.entity';
import { EntityProvider } from '../../entity-provider.class';

@Entity()
export class CollectionStat extends EntityProvider {
    @Column('int', { primary: true, unsigned: true, width: 10 })
    collectionID: number;

    @Column('int', { unsigned: true, default: () => "'0'" })
    recordCount: number;

    @Column('int', { nullable: true, unsigned: true })
    georeferencedCount: number | null;

    @Column('int', { nullable: true, unsigned: true })
    familyCount: number | null;

    @Column('int', { nullable: true, unsigned: true })
    genusCount: number | null;

    @Column('int', { nullable: true, unsigned: true })
    speciesCount: number | null;

    @Column('datetime', { nullable: true })
    uploadDate: Date | null;

    @Column('datetime', { nullable: true })
    lastModifiedTimestamp: Date | null;

    @Column('varchar', { nullable: true, length: 45 })
    uploadedBy: string;

    @Column('longtext', { nullable: true })
    dynamicProperties: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP()' })
    initialTimestamp: Date;

    @OneToOne(
        () => Collection,
        (omcollections) => omcollections.collectionStats,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn({ name: 'collectionID' })
    collection: Promise<Collection>;
}
