import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Agent } from './Agent.entity';
import { CtRelationshipType } from '../CtRelationshipType.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('fromagentid', ['agentFromID'])
@Index('toagentid', ['agentToID'])
@Index('relationship', ['relationshipName'])
@Entity('agentrelations')
export class AgentRelation extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'agentrelationsid' })
    id: string;

    @Column('bigint', { name: 'fromagentid' })
    agentFromID: number;

    @Column('bigint', { name: 'toagentid' })
    agentToID: number;

    @Column('varchar', { name: 'relationship', length: 50 })
    relationshipName: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 900 })
    notes: string | null;

    @Column('timestamp', {
        name: 'timestampcreated',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @Column('int', { name: 'createdbyuid', nullable: true })
    creatorUID: number | null;

    @Column('datetime', { name: 'datelastmodified', nullable: true })
    modifiedTimestamp: Date | null;

    @Column('int', { name: 'lastmodifiedbyuid', nullable: true })
    lastModifiedUID: number | null;

    @ManyToOne(() => Agent, (agents) => agents.agentRelationsFrom, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'fromagentid'}])
    agentFrom: Promise<Agent>;

    @ManyToOne(() => Agent, (agents) => agents.agentRelationsTo, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'toagentid'}])
    agentTo: Promise<Agent>;

    @ManyToOne(
        () => CtRelationshipType,
        (ctrelationshiptypes) => ctrelationshiptypes.agentRelations,
        { onDelete: 'NO ACTION', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{
        name: 'relationship',
        referencedColumnName: 'relationship'
    }])
    relationship: Promise<CtRelationshipType>;
}
