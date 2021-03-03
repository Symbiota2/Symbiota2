import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Index('ft_collectorbio', [
    'biography',
    'taxonomicGroups',
    'collectionsAt',
    'notes',
    'name'
], { fulltext: true })
@Entity('agentsfulltext')
export class AgentFullText extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'agentsfulltextid' })
    id: number;

    @Column('int', { name: 'agentid' })
    agentID: number;

    @Column('text', { name: 'biography', nullable: true })
    biography: string;

    @Column('text', { name: 'taxonomicgroups', nullable: true })
    taxonomicGroups: string;

    @Column('text', { name: 'collectionsat', nullable: true })
    collectionsAt: string;

    @Column('text', { name: 'notes', nullable: true })
    notes: string;

    @Column('text', { name: 'name', nullable: true })
    name: string;
}
