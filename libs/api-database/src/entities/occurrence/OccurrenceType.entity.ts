import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Occurrence } from './Occurrence.entity';
import { Reference } from '../reference';
import { Taxon } from '../taxonomy/Taxon.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['occurrenceID'])
@Index(['referenceID'])
@Index(['interpretedTaxonID'])
@Entity('omoccurrencetypes')
export class OccurrenceType extends EntityProvider {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'occurtypeid',
        unsigned: true
    })
    id: number;

    @Column('int', { name: 'occid', nullable: true, unsigned: true })
    occurrenceID: number | null;

    @Column('varchar', { name: 'typestatus', nullable: true, length: 45 })
    typeStatus: string;

    @Column('varchar', {
        name: 'typeDesignationType',
        nullable: true,
        length: 45,
    })
    typeDesignationType: string;

    @Column('varchar', { name: 'typeDesignatedBy', nullable: true, length: 45 })
    typeDesignatedBy: string;

    @Column('varchar', { name: 'scientificName', nullable: true, length: 250 })
    scientificName: string;

    @Column('varchar', {
        name: 'scientificNameAuthorship',
        nullable: true,
        length: 45,
    })
    scientificNameAuthorship: string;

    @Column('int', { name: 'tidinterpreted', nullable: true, unsigned: true })
    interpretedTaxonID: number | null;

    @Column('varchar', { name: 'basionym', nullable: true, length: 250 })
    basionym: string;

    @Column('int', { name: 'refid', nullable: true })
    referenceID: number | null;

    @Column('varchar', {
        name: 'bibliographicCitation',
        nullable: true,
        length: 250,
    })
    bibliographicCitation: string;

    @Column('varchar', {
        name: 'dynamicProperties',
        nullable: true,
        length: 250
    })
    dynamicProperties: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.occurrenceTypes,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;

    @ManyToOne(
        () => Reference,
        (referenceobject) => referenceobject.occurrenceTypes,
        { onDelete: 'SET NULL', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'refid'}])
    reference: Promise<Reference>;

    @ManyToOne(() => Taxon, (taxa) => taxa.occurrenceTypes, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'tidinterpreted'}])
    interpretedTaxon: Promise<Taxon>;
}
