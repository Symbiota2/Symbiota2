import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { OccurrenceLoanLink } from './OccurrenceLoanLink.entity';
import { Collection } from '../collection';
import { Institution } from '../Institution.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['ownerInstitutionID'])
@Index(['borrowerInstitutionID'])
@Index(['ownerCollectionID'])
@Index(['borrowerCollectionID'])
@Entity('omoccurloans')
export class OccurrenceLoan extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'loanid', unsigned: true })
    id: number;

    @Column('varchar', {
        name: 'loanIdentifierOwn',
        nullable: true,
        length: 30
    })
    ownerID: string;

    @Column('varchar', {
        name: 'loanIdentifierBorr',
        nullable: true,
        length: 30
    })
    borrowerID: string;

    @Column('int', { name: 'collidOwn', nullable: true, unsigned: true })
    ownerCollectionID: number | null;

    @Column('int', { name: 'collidBorr', nullable: true, unsigned: true })
    borrowerCollectionID: number | null;

    @Column('int', { name: 'iidOwner', nullable: true, unsigned: true })
    ownerInstitutionID: number | null;

    @Column('int', { name: 'iidBorrower', nullable: true, unsigned: true })
    borrowerInstitutionID: number | null;

    @Column('date', { name: 'dateSent', nullable: true })
    dateSent: string;

    @Column('date', { name: 'dateSentReturn', nullable: true })
    dateSentReturn: string;

    @Column('varchar', { name: 'receivedStatus', nullable: true, length: 250 })
    receivedStatus: string;

    @Column('int', { name: 'totalBoxes', nullable: true })
    totalBoxes: number | null;

    @Column('int', { name: 'totalBoxesReturned', nullable: true })
    totalBoxesReturned: number | null;

    @Column('int', { name: 'numSpecimens', nullable: true })
    numSpecimens: number | null;

    @Column('varchar', { name: 'shippingMethod', nullable: true, length: 50 })
    shippingMethod: string;

    @Column('varchar', {
        name: 'shippingMethodReturn',
        nullable: true,
        length: 50,
    })
    shippingMethodReturn: string;

    @Column('date', { name: 'dateDue', nullable: true })
    dateDue: string;

    @Column('date', { name: 'dateReceivedOwn', nullable: true })
    ownerDateReceived: string;

    @Column('date', { name: 'dateReceivedBorr', nullable: true })
    borrowerDateReceived: string;

    @Column('date', { name: 'dateClosed', nullable: true })
    dateClosed: string;

    @Column('varchar', { name: 'forWhom', nullable: true, length: 50 })
    forWhom: string;

    @Column('varchar', { name: 'description', nullable: true, length: 1000 })
    description: string;

    @Column('varchar', {
        name: 'invoiceMessageOwn',
        nullable: true,
        length: 500
    })
    ownerInvoiceMessage: string;

    @Column('varchar', {
        name: 'invoiceMessageBorr',
        nullable: true,
        length: 500,
    })
    borrowerInvoiceMessage: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 500 })
    notes: string;

    @Column('varchar', { name: 'createdByOwn', nullable: true, length: 30 })
    ownerCreatedBy: string;

    @Column('varchar', { name: 'createdByBorr', nullable: true, length: 30 })
    borrowerCreatedBy: string;

    @Column('int', {
        name: 'processingStatus',
        nullable: true,
        unsigned: true,
        default: () => '\'1\'',
    })
    processingStatus: number | null;

    @Column('varchar', { name: 'processedByOwn', nullable: true, length: 30 })
    ownerProcessedBy: string;

    @Column('varchar', { name: 'processedByBorr', nullable: true, length: 30 })
    borrowerProcessedBy: string;

    @Column('varchar', {
        name: 'processedByReturnOwn',
        nullable: true,
        length: 30,
    })
    ownerReturnProcessedBy: string;

    @Column('varchar', {
        name: 'processedByReturnBorr',
        nullable: true,
        length: 30,
    })
    borrowerReturnProcessedBy: string;

    @Column('timestamp', {
        name: 'initialTimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(
        () => OccurrenceLoanLink,
        (omoccurloanslink) => omoccurloanslink.loan
    )
    occurrenceLoanLinks: Promise<OccurrenceLoanLink[]>;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.occurrenceLoanBorrowers,
        { onDelete: 'RESTRICT', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'collidBorr'}])
    borrowerCollection: Promise<Collection>;

    @ManyToOne(() => Institution, (institutions) => institutions.occurrenceLoanBorrowers, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'iidBorrower'}])
    borrowerInstitution: Promise<Institution>;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.occurrenceLoanLenders,
        { onDelete: 'RESTRICT', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'collidOwn'}])
    ownerCollection: Promise<Collection>;

    @ManyToOne(() => Institution, (institutions) => institutions.occurrenceLoanLenders, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'iidOwner'}])
    ownerInstitution: Promise<Institution>;
}
