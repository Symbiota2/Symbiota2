import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Collector } from '../Collector.entity';
import { Occurrence } from './Occurrence.entity';
import { Taxon } from '../taxonomy/Taxon.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(
    'Index_unique',
    [
        'occurrenceID',
        'dateIdentified',
        'identifiedBy',
        'scientificName'
    ],
    { unique: true }
)
@Index(['interpretedTaxonID'])
@Index(['identifiedByID'])
@Index('Index_dateIdentInterpreted', ['dateIdentifiedInterpreted'])
@Entity('omoccurdeterminations')
export class OccurrenceDetermination extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'detid', unsigned: true })
    id: number;

    @Column('int', { name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('varchar', { name: 'identifiedBy', length: 60 })
    identifiedBy: string;

    @Column('int', { name: 'idbyid', nullable: true, unsigned: true })
    identifiedByID: number | null;

    @Column('varchar', { name: 'dateIdentified', length: 45 })
    dateIdentified: string;

    @Column('date', { name: 'dateIdentifiedInterpreted', nullable: true })
    dateIdentifiedInterpreted: string | null;

    @Column('varchar', { name: 'sciname', length: 100 })
    scientificName: string;

    @Column('int', { name: 'tidinterpreted', nullable: true, unsigned: true })
    interpretedTaxonID: number | null;

    @Column('varchar', {
        name: 'scientificNameAuthorship',
        nullable: true,
        length: 100,
    })
    scientificNameAuthorship: string | null;

    @Column('varchar', {
        name: 'identificationQualifier',
        nullable: true,
        length: 45,
    })
    identificationQualifier: string | null;

    @Column('int', { name: 'iscurrent', nullable: true, default: () => '\'0\'' })
    isCurrent: number | null;

    @Column('int', { name: 'printqueue', nullable: true, default: () => '\'0\'' })
    printQueue: number | null;

    @Column('int', {
        name: 'appliedStatus',
        nullable: true,
        default: () => '\'1\'',
    })
    appliedStatus: number | null;

    @Column('varchar', { name: 'detType', nullable: true, length: 45 })
    type: string | null;

    @Column('varchar', {
        name: 'identificationReferences',
        nullable: true,
        length: 255,
    })
    identificationReferences: string | null;

    @Column('varchar', {
        name: 'identificationRemarks',
        nullable: true,
        length: 500,
    })
    identificationRemarks: string | null;

    @Column('varchar', { name: 'sourceIdentifier', nullable: true, length: 45 })
    sourceIdentifier: string | null;

    @Column('int', {
        name: 'sortsequence',
        nullable: true,
        unsigned: true,
        default: () => '\'10\'',
    })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Collector,
        (omcollectors) => omcollectors.occurrenceDeterminations,
        { onDelete: 'SET NULL', onUpdate: 'SET NULL' }
    )
    @JoinColumn([{ name: 'idbyid'}])
    collector: Promise<Collector>;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.determinations,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;

    @ManyToOne(() => Taxon, (taxa) => taxa.occurrenceDeterminations, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'tidinterpreted'}])
    taxon: Promise<Taxon>;
}
