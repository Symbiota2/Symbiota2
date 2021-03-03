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

@Index('agentid', ['agentID'])
@Entity('agentnumberpattern')
export class AgentNumberPattern extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'agentnumberpatternid' })
    id: number;

    @Column('bigint', { name: 'agentid' })
    agentID: number;

    @Column('varchar', {
        name: 'numbertype',
        nullable: true,
        length: 50,
        default: () => '\'Collector number\'',
    })
    numberType: string;

    @Column('varchar', { name: 'numberpattern', nullable: true, length: 255 })
    numberPattern: string;

    @Column('varchar', {
        name: 'numberpatterndescription',
        nullable: true,
        length: 900,
    })
    numberPatternDesc: string;

    @Column('int', { name: 'startyear', nullable: true })
    startYear: number | null;

    @Column('int', { name: 'endyear', nullable: true })
    endYear: number | null;

    @Column('int', { name: 'integerincrement', nullable: true })
    integerIncrement: number | null;

    @Column('text', { name: 'notes', nullable: true })
    notes: string | null;

    @ManyToOne(() => Agent, (agents) => agents.agentNumberPatterns, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'agentid'}])
    agent: Promise<Agent>;
}
