import {
    Column,
    Entity,
    Index,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Collection } from '../collection';
import { EntityProvider } from '../../entity-provider.class';

@Index(['collectionID'], { unique: false })
@Entity('omcrowdsourcecentral')
export class CrowdSourceCentral extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'omcsid' })
    id: number;

    @Column('int', { name: 'collid', unique: true, unsigned: true })
    collectionID: number;

    @Column('text', { name: 'instructions', nullable: true })
    instructions: string | null;

    @Column('varchar', { name: 'trainingurl', nullable: true, length: 500 })
    trainingUrl: string | null;

    @Column('int', {
        name: 'editorlevel',
        comment: '0=public, 1=public limited, 2=private',
        default: () => '\'0\'',
    })
    editorLevel: number;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToOne(
        () => Collection,
        (omcollections) => omcollections.crowdSourceCentral,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'collid'}])
    collection: Promise<Collection>;
}
