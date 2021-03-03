import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CollectionPublicationOccurrenceLink } from './CollectionPublicationOccurrenceLink.entity';
import { Collection } from './Collection.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['collectionID'])
@Entity('omcollpublications')
export class CollectionPublication extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'pubid', unsigned: true })
    id: number;

    @Column('int', { name: 'collid', unsigned: true })
    collectionID: number;

    @Column('varchar', { name: 'targeturl', length: 250 })
    targetUrl: string;

    @Column('varchar', { name: 'securityguid', length: 45 })
    securityGUID: string;

    @Column('varchar', { name: 'criteriajson', nullable: true, length: 250 })
    criteriaJSON: string | null;

    @Column('int', {
        name: 'includedeterminations',
        nullable: true,
        default: () => '\'1\'',
    })
    includeDeterminations: number | null;

    @Column('int', {
        name: 'includeimages',
        nullable: true,
        default: () => '\'1\'',
    })
    includeImages: number | null;

    @Column('int', { name: 'autoupdate', nullable: true, default: () => '\'0\'' })
    autoUpdate: number | null;

    @Column('datetime', { name: 'lastdateupdate', nullable: true })
    lastModifiedTimestamp: Date | null;

    @Column('int', { name: 'updateinterval', nullable: true })
    updateInterval: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @OneToMany(
        () => CollectionPublicationOccurrenceLink,
        (omcollpuboccurlink) => omcollpuboccurlink.publication
    )
    occurrencePublicationLinks: Promise<CollectionPublicationOccurrenceLink[]>;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.collectionPublications,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'collid'}])
    collection: Promise<Collection>;
}
