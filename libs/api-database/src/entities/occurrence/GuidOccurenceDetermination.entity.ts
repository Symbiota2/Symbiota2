import { Column, Entity, Index } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Index('guidoccurdet_detid_unique', ['determinationID'], { unique: true })
@Entity('guidoccurdeterminations')
export class GuidOccurenceDetermination extends EntityProvider {
    @Column('varchar', { primary: true, name: 'guid', length: 45 })
    guid: string;

    @Column('int', {
        name: 'detid',
        nullable: true,
        unique: true,
        unsigned: true,
    })
    determinationID: number | null;

    @Column('int', { name: 'archivestatus', default: () => '\'0\'' })
    archiveStatus: number;

    @Column('text', { name: 'archiveobj', nullable: true })
    archiveObject: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;
}
