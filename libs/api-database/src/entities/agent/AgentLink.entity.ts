import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Entity('agentlinks')
export class AgentLink extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'agentlinksid' })
    id: number;

    @Column('int', { name: 'agentid' })
    agentID: number;

    @Column('varchar', { name: 'type', nullable: true, length: 50 })
    type: string;

    @Column('varchar', { name: 'link', nullable: true, length: 900 })
    link: string;

    @Column('tinyint', {
        name: 'isprimarytopicof',
        width: 1,
        default: () => '\'1\'',
    })
    isPrimaryTopicOf: boolean;

    @Column('varchar', { name: 'text', nullable: true, length: 50 })
    text: string;

    @Column('timestamp', {
        name: 'timestampcreated',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @Column('int', { name: 'createdbyuid' })
    creatorUID: number;

    @Column('datetime', { name: 'datelastmodified', nullable: true })
    modifiedTimestamp: Date;

    @Column('int', { name: 'lastmodifiedbyuid', nullable: true })
    lastModifiedUID: number | null;
}
