import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Collection } from './Collection.entity';
import { OccurrenceLoan } from '../occurrence/OccurrenceLoan.entity';
import { User } from '../user/User.entity';
import { EntityProvider } from '../../entity-provider.class';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ApiInstitutionOutput } from '@symbiota2/data-access';

@Exclude()
@Index(['lastModifiedUID'])
@Entity('institutions')
export class Institution extends EntityProvider implements ApiInstitutionOutput {
    @ApiProperty()
    @Expose({ groups: ['single', 'list'] })
    @PrimaryGeneratedColumn({ type: 'int', name: 'iid', unsigned: true })
    id: number;

    @ApiProperty()
    @Expose({ groups: ['single', 'list'] })
    @Column('varchar', { name: 'InstitutionCode', length: 45 })
    code: string;

    @ApiProperty()
    @Expose({ groups: ['single', 'list'] })
    @Column('varchar', { name: 'InstitutionName', length: 150 })
    name: string;

    @Column('varchar', {
        name: 'InstitutionName2',
        nullable: true,
        length: 150
    })
    name2: string;

    @ApiProperty()
    @Expose({ groups: ['single'] })
    @Column('varchar', { name: 'Address1', nullable: true, length: 150 })
    address1: string;

    @ApiProperty()
    @Expose({ groups: ['single'] })
    @Column('varchar', { name: 'Address2', nullable: true, length: 150 })
    address2: string;

    @ApiProperty()
    @Expose({ groups: ['single'] })
    @Column('varchar', { name: 'City', nullable: true, length: 45 })
    city: string;

    @ApiProperty()
    @Expose({ groups: ['single'] })
    @Column('varchar', { name: 'StateProvince', nullable: true, length: 45 })
    stateProvince: string;

    @ApiProperty()
    @Expose({ groups: ['single'] })
    @Column('varchar', { name: 'PostalCode', nullable: true, length: 45 })
    postalCode: string;

    @ApiProperty()
    @Expose({ groups: ['single'] })
    @Column('varchar', { name: 'Country', nullable: true, length: 45 })
    country: string;

    @ApiProperty()
    @Expose({ groups: ['single'] })
    @Column('varchar', { name: 'Phone', nullable: true, length: 45 })
    phone: string;

    @ApiProperty()
    @Expose({ groups: ['single'] })
    @Column('varchar', { name: 'Contact', nullable: true, length: 65 })
    contact: string;

    @ApiProperty()
    @Expose({ groups: ['single'] })
    @Column('varchar', { name: 'Email', nullable: true, length: 45 })
    email: string;

    @ApiProperty()
    @Expose({ groups: ['single'] })
    @Column('varchar', { name: 'Url', nullable: true, length: 250 })
    url: string;

    @ApiProperty()
    @Expose({ groups: ['single'] })
    @Column('varchar', { name: 'Notes', nullable: true, length: 250 })
    notes: string;

    @Column('int', { name: 'modifieduid', nullable: true, unsigned: true })
    lastModifiedUID: number | null;

    @Column('datetime', { name: 'modifiedTimeStamp', nullable: true })
    lastModifiedTimestamp: Date | null;

    @ApiProperty()
    @Expose({ groups: ['single'] })
    @Column('timestamp', {
        name: 'IntialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(() => Collection, (omcollections) => omcollections.institution)
    collections: Promise<Collection[]>;

    @OneToMany(() => OccurrenceLoan, (omoccurloans) => omoccurloans.borrowerInstitution)
    occurrenceLoanBorrowers: Promise<OccurrenceLoan[]>;

    @OneToMany(() => OccurrenceLoan, (omoccurloans) => omoccurloans.ownerInstitution)
    occurrenceLoanLenders: Promise<OccurrenceLoan[]>;

    @ManyToOne(() => User, (users) => users.institutions, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    @JoinColumn([{ name: 'modifieduid', referencedColumnName: 'uid' }])
    lastModifiedUser: Promise<User>;
}
