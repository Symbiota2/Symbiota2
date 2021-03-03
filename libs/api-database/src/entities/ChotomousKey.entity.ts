import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Taxon } from './taxonomy/Taxon.entity';
import { EntityProvider } from '../entity-provider.class';

@Index(['taxonID'])
@Entity('chotomouskey')
export class ChotomousKey extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'stmtid', unsigned: true })
    statementID: number;

    @Column('varchar', { name: 'statement', length: 300 })
    statement: string;

    @Column('int', { name: 'nodeid', unsigned: true })
    nodeID: number;

    @Column('int', { name: 'parentid', unsigned: true })
    parentID: number;

    @Column('int', { name: 'tid', nullable: true, unsigned: true })
    taxonID: number | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Taxon, (taxa) => taxa.chotomousKeys, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;
}
