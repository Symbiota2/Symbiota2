import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { ChecklistCoordinatePair } from './ChecklistCoordinatePair.entity';
import { ChecklistTaxonStatus } from './ChecklistTaxonStatus.entity';
import { ReferenceChecklistTaxonLink } from '../reference';
import { ChecklistTaxonComment } from './ChecklistTaxonComment.entity';
import { Checklist } from './Checklist.entity';
import { Taxon } from '../taxonomy/Taxon.entity';
import { Voucher } from '../Voucher.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['checklistID'])
@Entity('fmchklsttaxalink')
export class ChecklistTaxonLink extends EntityProvider {
    @Column('int', {
        primary: true,
        name: 'TID',
        unsigned: true,
        default: () => '\'0\'',
    })
    taxonID: number;

    @Column('int', {
        primary: true,
        name: 'CLID',
        unsigned: true,
        default: () => '\'0\'',
    })
    checklistID: number;

    @Column('varchar', {
        primary: true,
        name: 'morphospecies',
        length: 45,
        default: () => '\'\'',
    })
    morphoSpecies: string;

    @Column('varchar', { name: 'familyoverride', nullable: true, length: 50 })
    familyOverride: string;

    @Column('varchar', { name: 'Habitat', nullable: true, length: 250 })
    habitat: string;

    @Column('varchar', { name: 'Abundance', nullable: true, length: 50 })
    abundance: string;

    @Column('varchar', { name: 'Notes', nullable: true, length: 2000 })
    notes: string;

    @Column('smallint', { name: 'explicitExclude', nullable: true })
    explicitExclude: number | null;

    @Column('varchar', { name: 'source', nullable: true, length: 250 })
    source: string;

    @Column('varchar', {
        name: 'Nativity',
        nullable: true,
        comment: 'native, introducted',
        length: 50,
    })
    nativity: string;

    @Column('varchar', { name: 'Endemic', nullable: true, length: 45 })
    endemic: string;

    @Column('varchar', { name: 'invasive', nullable: true, length: 45 })
    invasive: string;

    @Column('varchar', { name: 'internalnotes', nullable: true, length: 250 })
    internalNotes: string;

    @Column('text', { name: 'dynamicProperties', nullable: true })
    dynamicProperties: string;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(
        () => ChecklistCoordinatePair,
        (fmchklstcoordinates) => fmchklstcoordinates.checklistTaxonLink
    )
    checklistCoordinates: Promise<ChecklistCoordinatePair[]>;

    @OneToOne(
        () => ChecklistTaxonStatus,
        (fmchklsttaxastatus) => fmchklsttaxastatus.checklistTaxonLink
    )
    taxonStatus: Promise<ChecklistTaxonStatus>;

    @OneToMany(
        () => ReferenceChecklistTaxonLink,
        (referencechklsttaxalink) => referencechklsttaxalink.checklistTaxonLink
    )
    referencedChecklistTaxonLink: Promise<ReferenceChecklistTaxonLink[]>;

    @OneToMany(
        () => ChecklistTaxonComment,
        (fmcltaxacomments) => fmcltaxacomments.checklistTaxonLink
    )
    taxonComments: Promise<ChecklistTaxonComment[]>;

    @ManyToOne(
        () => Checklist,
        (fmchecklists) => fmchecklists.taxaLinks,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'CLID'}])
    checklist: Promise<Checklist>;

    @ManyToOne(() => Taxon, (taxa) => taxa.checklistLinks, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'TID'}])
    taxon: Promise<Taxon>;

    @OneToMany(() => Voucher, (fmvouchers) => fmvouchers.checklistTaxonLink)
    vouchers: Promise<Voucher[]>;
}
