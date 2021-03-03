import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Occurrence } from './occurrence';
import { ChecklistTaxonLink } from './checklist';
import { EntityProvider } from '../entity-provider.class';

@Index('chklst_taxavouchers', ['taxonID', 'checklistID'])
@Entity('fmvouchers')
export class Voucher extends EntityProvider {
    @Column('int', { name: 'TID', nullable: true, unsigned: true })
    taxonID: number | null;

    @Column('int', { primary: true, name: 'CLID', unsigned: true })
    checklistID: number;

    @Column('int', { primary: true, name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('varchar', { name: 'editornotes', nullable: true, length: 50 })
    editorNotes: string;

    @Column('int', {
        name: 'preferredImage',
        nullable: true,
        default: () => '\'0\'',
    })
    preferredImage: number | null;

    @Column('varchar', { name: 'Notes', nullable: true, length: 250 })
    notes: string;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Occurrence, (omoccurrences) => omoccurrences.fmvouchers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;

    @ManyToOne(
        () => ChecklistTaxonLink,
        (fmchklsttaxalink) => fmchklsttaxalink.vouchers,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([
        { name: 'TID', referencedColumnName: 'taxonID' },
        { name: 'CLID', referencedColumnName: 'checklistID' },
    ])
    checklistTaxonLink: Promise<ChecklistTaxonLink>;
}
