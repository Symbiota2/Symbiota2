import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterState } from './CharacterState.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['characteristicID', 'characterStateID'])
@Entity('kmcsimages')
export class CharacterStateImage extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'csimgid', unsigned: true })
    characterStateImageID: number;

    @Column('int', { name: 'cid', unsigned: true })
    characteristicID: number;

    @Column('varchar', { name: 'cs', length: 16 })
    characterStateID: string;

    @Column('varchar', { name: 'url', length: 255 })
    url: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('varchar', {
        name: 'sortsequence',
        length: 45,
        default: () => '\'50\'',
    })
    sortSequence: string;

    @Column('varchar', { name: 'username', nullable: true, length: 45 })
    username: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => CharacterState, (kmcs) => kmcs.characterStateImages, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([
        { name: 'cid', referencedColumnName: 'characteristicID'},
        { name: 'cs', referencedColumnName: 'characterState' },
    ])
    characterState: Promise<CharacterState>;
}
