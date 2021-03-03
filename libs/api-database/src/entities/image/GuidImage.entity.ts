import { Column, Entity, Index } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Index('guidimages_imgid_unique', ['imageID'], { unique: true })
@Entity('guidimages')
export class GuidImage extends EntityProvider {
    @Column('varchar', { primary: true, name: 'guid', length: 45 })
    guid: string;

    @Column('int', {
        name: 'imgid',
        nullable: true,
        unique: true,
        unsigned: true,
    })
    imageID: number | null;

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
