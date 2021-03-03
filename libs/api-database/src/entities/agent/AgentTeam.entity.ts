import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Agent } from './Agent.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('teamagentid', ['agentID'])
@Index('memberagentid', ['memberID'])
@Entity('agentteams')
export class AgentTeam extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'agentteamid' })
    id: string;

    @Column('bigint', { name: 'teamagentid' })
    agentID: string;

    @Column('bigint', { name: 'memberagentid' })
    memberID: string;

    @Column('int', { name: 'ordinal', nullable: true })
    ordinal: number | null;

    @ManyToOne(() => Agent, (agents) => agents.teams, {
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'teamagentid'}])
    agent: Promise<Agent>;

    @ManyToOne(() => Agent, (agents) => agents.memberOf, {
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'memberagentid'}])
    member: Promise<Agent>;
}
