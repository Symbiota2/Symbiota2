import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Occurrence } from './occurrence/Occurrence.entity';
import { Taxon } from './taxonomy/Taxon.entity';
import { User } from './user/User.entity';
import { EntityProvider } from '../entity-provider.class';

@Index(['taxonID'])
@Index(['occurrenceID'])
@Index(['authorUID'])
@Entity('media')
export class Medium extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'mediaid', unsigned: true })
    id: number;

    @Column('int', { name: 'tid', nullable: true, unsigned: true })
    taxonID: number | null;

    @Column('int', { name: 'occid', nullable: true, unsigned: true })
    occurrenceID: number | null;

    @Column('varchar', { name: 'url', length: 250 })
    url: string;

    @Column('varchar', { name: 'caption', nullable: true, length: 250 })
    caption: string | null;

    @Column('int', { name: 'authoruid', nullable: true, unsigned: true })
    authorUID: number | null;

    @Column('varchar', { name: 'author', nullable: true, length: 45 })
    authorName: string | null;

    @Column('varchar', { name: 'mediatype', nullable: true, length: 45 })
    type: string | null;

    @Column('varchar', { name: 'owner', nullable: true, length: 250 })
    owner: string | null;

    @Column('varchar', { name: 'sourceurl', nullable: true, length: 250 })
    sourceUrl: string | null;

    @Column('varchar', { name: 'locality', nullable: true, length: 250 })
    locality: string | null;

    @Column('varchar', { name: 'description', nullable: true, length: 1000 })
    description: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('varchar', { name: 'mediaMD5', nullable: true, length: 45 })
    mediaMD5: string | null;

    @Column('int', { name: 'sortsequence', nullable: true })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(() => Occurrence, (omoccurrences) => omoccurrences.media, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;

    @ManyToOne(() => Taxon, (taxa) => taxa.media, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;

    @ManyToOne(() => User, (users) => users.media, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'authoruid', referencedColumnName: 'uid' }])
    author: Promise<User>;
}
