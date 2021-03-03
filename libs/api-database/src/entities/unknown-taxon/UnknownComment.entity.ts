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
@Entity('unknowncomments')
export class UnknownComment extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'unkcomid', unsigned: true })
    id: number;

    @Column('int', { name: 'unkid', unsigned: true })
    unknownID: number;

    @Column('varchar', { name: 'comment', length: 500 })
    comment: string;

    @Column('varchar', { name: 'username', length: 45 })
    username: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Unknown, (unknowns) => unknowns.comments, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'unkid'}])
    unknown: Promise<Unknown>;
}
