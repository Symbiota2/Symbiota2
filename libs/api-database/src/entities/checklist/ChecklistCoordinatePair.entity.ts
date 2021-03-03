import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ChecklistTaxonLink } from './ChecklistTaxonLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('IndexUnique', ['checklistID', 'taxonID', 'latitude', 'longitude'], {
    unique: true,
})
@Index(['checklistID', 'taxonID'])
@Entity('fmchklstcoordinates')
export class ChecklistCoordinatePair extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'chklstcoordid' })
    id: number;

    @Column('int', { name: 'clid', unsigned: true, width: 10 })
    checklistID: number;

    @Column('int', { name: 'tid', unsigned: true })
    taxonID: number;

    @Column('double', { name: 'decimallatitude', precision: 22 })
    latitude: number;

    @Column('double', { name: 'decimallongitude', precision: 22 })
    longitude: number;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => ChecklistTaxonLink,
        (fmchklsttaxalink) => fmchklsttaxalink.checklistCoordinates,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([
        { name: 'clid', referencedColumnName: 'checklistID' },
        { name: 'tid', referencedColumnName: 'taxonID' },
    ])
    checklistTaxonLink: Promise<ChecklistTaxonLink>;
}
