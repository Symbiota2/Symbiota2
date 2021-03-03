import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { ChecklistTaxonLink } from './ChecklistTaxonLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['checklistID', 'taxonID'])
@Entity('fmchklsttaxastatus')
export class ChecklistTaxonStatus extends EntityProvider {
    @Column('int', { primary: true, name: 'clid', unsigned: true })
    checklistID: number;

    @Column('int', { primary: true, name: 'tid', unsigned: true })
    taxonID: number;

    @Column('int', { name: 'geographicRange', default: () => '\'0\'' })
    geographicRange: number;

    @Column('int', { name: 'populationRank', default: () => '\'0\'' })
    populationRank: number;

    @Column('int', { name: 'abundance', default: () => '\'0\'' })
    abundance: number;

    @Column('int', { name: 'habitatSpecificity', default: () => '\'0\'' })
    habitatSpecificity: number;

    @Column('int', { name: 'intrinsicRarity', default: () => '\'0\'' })
    intrinsicRarity: number;

    @Column('int', { name: 'threatImminence', default: () => '\'0\'' })
    threatImminence: number;

    @Column('int', { name: 'populationTrends', default: () => '\'0\'' })
    populationTrends: number;

    @Column('varchar', { name: 'nativeStatus', nullable: true, length: 45 })
    nativeStatus: string;

    @Column('int', { name: 'endemicStatus', default: () => '\'0\'' })
    endemicStatus: number;

    @Column('varchar', { name: 'protectedStatus', nullable: true, length: 45 })
    protectedStatus: string;

    @Column('int', { name: 'localitySecurity', nullable: true })
    localitySecurity: number | null;

    @Column('varchar', {
        name: 'localitySecurityReason',
        nullable: true,
        length: 45,
    })
    localitySecurityReason: string;

    @Column('varchar', { name: 'invasiveStatus', nullable: true, length: 45 })
    invasiveStatus: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('int', { name: 'modifiedUid', nullable: true, unsigned: true })
    lastModifiedUID: number | null;

    @Column('datetime', { name: 'modifiedtimestamp', nullable: true })
    modifiedTimestamp: Date;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToOne(
        () => ChecklistTaxonLink,
        (fmchklsttaxalink) => fmchklsttaxalink.taxonStatus,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([
        { name: 'clid', 'referencedColumnName': 'checklistID' },
        { name: 'tid', 'referencedColumnName': 'taxonID' },
    ])
    checklistTaxonLink: Promise<ChecklistTaxonLink>;
}
