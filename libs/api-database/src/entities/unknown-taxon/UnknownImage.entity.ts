import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Unknown } from './Unknown.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['unknownID'])
@Entity('unknownimages')
export class UnknownImage extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'unkimgid', unsigned: true })
    id: number;

    @Column('int', { name: 'unkid', unsigned: true })
    unknownID: number;

    @Column('varchar', { name: 'url', length: 255 })
    url: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Unknown, (unknowns) => unknowns.images, {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'unkid'}])
    unknown: Promise<Unknown>;
}
