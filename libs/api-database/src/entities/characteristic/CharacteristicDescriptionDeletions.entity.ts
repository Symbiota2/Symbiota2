import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Entity('kmdescrdeletions')
export class CharacteristicDescriptionDeletions extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'PK', unsigned: true })
    id: number;

    @Column('int', { name: 'TID', unsigned: true })
    taxonID: number;

    @Column('int', { name: 'CID', unsigned: true })
    characteristicID: number;

    @Column('varchar', { name: 'CS', length: 16 })
    characterStateID: string;

    @Column('varchar', { name: 'Modifier', nullable: true, length: 255 })
    modifier: string | null;

    @Column('double', { name: 'X', nullable: true, precision: 15, scale: 5 })
    x: number | null;

    @Column('longtext', { name: 'TXT', nullable: true })
    txt: string | null;

    @Column('varchar', { name: 'Inherited', nullable: true, length: 50 })
    inherited: string | null;

    @Column('varchar', { name: 'Source', nullable: true, length: 100 })
    source: string | null;

    @Column('int', { name: 'Seq', nullable: true, unsigned: true })
    sequence: number | null;

    @Column('longtext', { name: 'Notes', nullable: true })
    notes: string | null;

    @Column('datetime', { name: 'InitialTimeStamp', nullable: true })
    initialTimestamp: Date | null;

    @Column('varchar', { name: 'DeletedBy', length: 100 })
    deletedBy: string;

    @Column('timestamp', {
        name: 'DeletedTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    deletedTimestamp: Date;
}
