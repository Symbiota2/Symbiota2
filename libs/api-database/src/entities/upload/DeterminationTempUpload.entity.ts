import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Index('Index_uploaddet_occid', ['occurrenceID'])
@Index('Index_uploaddet_collid', ['collectionID'])
@Index('Index_uploaddet_dbpk', ['dbpk'])
@Entity('uploaddetermtemp')
export class AddDeterminationTempUpload extends EntityProvider {
    @PrimaryGeneratedColumn({ name: 'id', unsigned: true })
    id: number;

    @Column('int', { name: 'occid', nullable: true, unsigned: true })
    occurrenceID: number | null;

    @Column('int', { name: 'collid', nullable: true, unsigned: true })
    collectionID: number | null;

    // TODO: Better name
    @Column('varchar', { name: 'dbpk', nullable: true, length: 150 })
    dbpk: string | null;

    @Column('varchar', { name: 'identifiedBy', length: 60 })
    identifiedBy: string;

    @Column('varchar', { name: 'dateIdentified', length: 45 })
    dateIdentified: string;

    @Column('date', { name: 'dateIdentifiedInterpreted', nullable: true })
    dateIdentifiedInterpreted: string | null;

    @Column('varchar', { name: 'sciname', length: 100 })
    scientificName: string;

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

    @Column('varchar', { name: 'detType', nullable: true, length: 45 })
    determinationType: string | null;

    @Column('varchar', {
        name: 'identificationReferences',
        nullable: true,
        length: 255,
    })
    identificationReferences: string | null;

    @Column('varchar', {
        name: 'identificationRemarks',
        nullable: true,
        length: 255,
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
}
