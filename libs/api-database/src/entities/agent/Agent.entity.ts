import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AgentNumberPattern } from './AgentNumberPattern.entity';
import { AgentRelation } from './AgentRelation.entity';
import { AgentTeam } from './AgentTeam.entity';
import { Occurrence } from '../occurrence/Occurrence.entity';
import { EntityProvider } from '../../entity-provider.class';

enum AgentType {
    INDIVIDUAL = 'Individual',
    TEAM = 'Team',
    ORGANIZATION = 'Organization'
}

enum LivingEnum {
    YES = 'Y',
    NO = 'N',
    UNKNOWN = '?'
}

@Index('firstname', ['firstName'])
@Index(['preferredRecByID'])
@Entity('agents')
export class Agent extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'agentid' })
    id: number;

    @Column('varchar', { name: 'familyname', length: 45 })
    familyName: string;

    @Column('varchar', { name: 'firstname', nullable: true, length: 45 })
    firstName: string;

    @Column('varchar', { name: 'middlename', nullable: true, length: 45 })
    middleName: string;

    @Column('int', { name: 'startyearactive', nullable: true })
    startYearActive: number | null;

    @Column('int', { name: 'endyearactive', nullable: true })
    endYearActive: number | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 255 })
    notes: string;

    @Column('int', { name: 'rating', nullable: true, default: () => '\'10\'' })
    rating: number | null;

    @Column('varchar', { name: 'guid', nullable: true, length: 900 })
    guid: string;

    @Column('bigint', { name: 'preferredrecbyid', nullable: true })
    preferredRecByID: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @Column('char', { name: 'uuid', nullable: true, length: 43 })
    uuid: string;

    @Column('text', { name: 'biography', nullable: true })
    biography: string;

    @Column('varchar', { name: 'taxonomicgroups', nullable: true, length: 900 })
    taxonomicGroups: string;

    @Column('varchar', { name: 'collectionsat', nullable: true, length: 900 })
    collectionsAt: string;

    @Column('tinyint', {
        name: 'curated',
        nullable: true,
        width: 1,
        default: () => '\'0\'',
    })
    curated: boolean | null;

    @Column('tinyint', {
        name: 'nototherwisespecified',
        nullable: true,
        width: 1,
        default: () => '\'0\'',
    })
    notOtherwiseSpecified: boolean | null;

    @Column('enum', {
        name: 'type',
        nullable: true,
        enum: AgentType
    })
    type: AgentType | null;

    @Column('varchar', { name: 'prefix', nullable: true, length: 32 })
    prefix: string;

    @Column('varchar', { name: 'suffix', nullable: true, length: 32 })
    suffix: string;

    @Column('text', { name: 'namestring', nullable: true })
    nameString: string;

    // TODO: What's this?
    @Column('char', { name: 'mbox_sha1sum', nullable: true, length: 40 })
    mBoxSHA1Sum: string;

    @Column('int', { name: 'yearofbirth', nullable: true })
    yearOfBirth: number | null;

    @Column('varchar', {
        name: 'yearofbirthmodifier',
        nullable: true,
        length: 12,
        default: () => '\'\'',
    })
    yearOfBirthModifier: string;

    @Column('int', { name: 'yearofdeath', nullable: true })
    yearOfDeath: number | null;

    @Column('varchar', {
        name: 'yearofdeathmodifier',
        nullable: true,
        length: 12,
        default: () => '\'\'',
    })
    yearOfDeathModifier: string;

    @Column('enum', {
        name: 'living',
        enum: LivingEnum,
        default: LivingEnum.UNKNOWN,
    })
    living: LivingEnum;

    @Column('datetime', { name: 'datelastmodified', nullable: true })
    modifiedTimestamp: Date;

    @Column('int', { name: 'lastmodifiedbyuid', nullable: true })
    lastModifiedUID: number | null;

    @OneToMany(
        () => AgentNumberPattern,
        (agentnumberpattern) => agentnumberpattern.agent
    )
    agentNumberPatterns: AgentNumberPattern[];

    @OneToMany(() => AgentRelation, (agentRelation) => agentRelation.agentFrom)
    agentRelationsFrom: Promise<AgentRelation[]>;

    @OneToMany(() => AgentRelation, (agentRelation) => agentRelation.agentTo)
    agentRelationsTo: AgentRelation[];

    @ManyToOne(() => Agent, (agents) => agents.preferredRecFor, {
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'preferredrecbyid'}])
    preferredRecBy: Promise<Agent>;

    @OneToMany(() => Agent, (agents) => agents.preferredRecBy)
    preferredRecFor: Promise<Agent[]>;

    @OneToMany(() => AgentTeam, (agentteams) => agentteams.agent)
    teams: Promise<AgentTeam[]>;

    @OneToMany(() => AgentTeam, (agentteams) => agentteams.member)
    memberOf: Promise<AgentTeam[]>;

    @OneToMany(() => Occurrence, (omoccurrences) => omoccurrences.recordedBy)
    occurrences: Promise<Occurrence[]>;
}
