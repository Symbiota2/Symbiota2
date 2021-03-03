import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Index('agentid', ['agentID', 'type', 'collectorName'], { unique: true })
@Index('type', ['type'])
@Index('ft_collectorname', ['collectorName'], { fulltext: true })
@Entity('agentnames')
export class AgentName extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'agentnamesid' })
    id: number;

    @Column('int', { name: 'agentid' })
    agentID: number;

    @Column('varchar', {
        name: 'type',
        length: 32,
        default: () => '\'Full Name\''
    })
    type: string;

    @Column('varchar', { name: 'name', nullable: true, length: 255 })
    collectorName: string;

    @Column('varchar', {
        name: 'language',
        nullable: true,
        length: 6,
        default: () => '\'en_us\'',
    })
    language: string;

    @Column('timestamp', {
        name: 'timestampcreated',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @Column('int', { name: 'createdbyuid', nullable: true })
    creatorUID: number | null;

    @Column('datetime', { name: 'datelastmodified', nullable: true })
    modifiedTimestamp: Date;

    @Column('int', { name: 'lastmodifiedbyuid', nullable: true })
    lastModifiedUID: number | null;
}
