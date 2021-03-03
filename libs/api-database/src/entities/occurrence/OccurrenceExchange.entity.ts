import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Collection } from '../collection';
import { EntityProvider } from '../../entity-provider.class';

@Index(['collectionID'])
@Entity('omoccurexchange')
export class OccurrenceExchange extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'exchangeid', unsigned: true })
    id: number;

    @Column('varchar', { name: 'identifier', nullable: true, length: 30 })
    identifier: string | null;

    @Column('int', { name: 'collid', nullable: true, unsigned: true })
    collectionID: number | null;

    @Column('int', { name: 'iid', nullable: true, unsigned: true })
    institutionID: number | null;

    @Column('varchar', { name: 'transactionType', nullable: true, length: 10 })
    transactionType: string | null;

    @Column('varchar', { name: 'in_out', nullable: true, length: 3 })
    inOut: string | null;

    @Column('date', { name: 'dateSent', nullable: true })
    dateSent: string | null;

    @Column('date', { name: 'dateReceived', nullable: true })
    dateReceived: string | null;

    @Column('int', { name: 'totalBoxes', nullable: true })
    totalBoxes: number | null;

    @Column('varchar', { name: 'shippingMethod', nullable: true, length: 50 })
    shippingMethod: string | null;

    // TODO: Better names for next 2
    @Column('int', { name: 'totalExMounted', nullable: true })
    totalExMounted: number | null;

    @Column('int', { name: 'totalExUnmounted', nullable: true })
    totalExUnmounted: number | null;

    @Column('int', { name: 'totalGift', nullable: true })
    totalGift: number | null;

    // TODO: Better name
    @Column('int', { name: 'totalGiftDet', nullable: true })
    totalGiftDet: number | null;

    @Column('int', { name: 'adjustment', nullable: true })
    adjustment: number | null;

    @Column('int', { name: 'invoiceBalance', nullable: true })
    invoiceBalance: number | null;

    @Column('varchar', { name: 'invoiceMessage', nullable: true, length: 500 })
    invoiceMessage: string | null;

    @Column('varchar', { name: 'description', nullable: true, length: 1000 })
    description: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 500 })
    notes: string | null;

    @Column('varchar', { name: 'createdBy', nullable: true, length: 20 })
    createdBy: string | null;

    @Column('timestamp', {
        name: 'initialTimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.occurrenceExchanges,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'collid'}])
    collection: Promise<Collection>;
}
