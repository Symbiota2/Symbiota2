import { Column, Entity, Index } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Index('guidoccurrences_occid_unique', ['occurrenceID'], { unique: true })
@Entity('guidoccurrences')
export class GuidOccurrence extends EntityProvider {
    @Column('varchar', { primary: true, name: 'guid', length: 45 })
    guid: string;

    @Column('int', {
        name: 'occid',
        nullable: true,
        unique: true,
        unsigned: true,
    })
    occurrenceID: number | null;

    @Column('int', { name: 'archivestatus', default: () => '\'0\'' })
    archiveStatus: number;

    @Column('text', { name: 'archiveobj', nullable: true })
    archiveObject: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;
}
