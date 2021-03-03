import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ChecklistChild } from './ChecklistChild.entity';
import { ChecklistTaxonLink } from './ChecklistTaxonLink.entity';
import { ReferenceChecklistLink } from '../reference';
import { User } from '../user/User.entity';
import { ChecklistProjectLink } from './ChecklistProjectLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['creatorUID'])
@Index('name', ['name', 'type'])
@Entity('fmchecklists')
export class Checklist extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'CLID', unsigned: true })
    id: number;

    @Column('varchar', { name: 'Name', length: 100 })
    name: string;

    @Column('varchar', { name: 'Title', nullable: true, length: 150 })
    title: string;

    @Column('varchar', { name: 'Locality', nullable: true, length: 500 })
    locality: string;

    @Column('varchar', { name: 'Publication', nullable: true, length: 500 })
    publication: string;

    @Column('text', { name: 'Abstract', nullable: true })
    abstract: string;

    @Column('varchar', { name: 'Authors', nullable: true, length: 250 })
    authors: string;

    @Column('varchar', {
        name: 'Type',
        nullable: true,
        length: 50,
        default: () => '\'static\'',
    })
    type: string;

    @Column('varchar', {
        name: 'politicalDivision',
        nullable: true,
        length: 45
    })
    politicalDivision: string;

    @Column('varchar', { name: 'dynamicsql', nullable: true, length: 500 })
    dynamicSQL: string;

    @Column('varchar', { name: 'Parent', nullable: true, length: 50 })
    parentName: string;

    @Column('int', { name: 'parentclid', nullable: true, unsigned: true })
    parentChecklistID: number | null;

    @Column('varchar', { name: 'Notes', nullable: true, length: 500 })
    notes: string;

    @Column('double', {
        name: 'LatCentroid',
        nullable: true,
        precision: 9,
        scale: 6,
    })
    latCentroid: number | null;

    @Column('double', {
        name: 'LongCentroid',
        nullable: true,
        precision: 9,
        scale: 6,
    })
    longCentroid: number | null;

    @Column('int', {
        name: 'pointradiusmeters',
        nullable: true,
        unsigned: true
    })
    pointRadiusMeters: number | null;

    @Column('text', { name: 'footprintWKT', nullable: true })
    footprintWKT: string;

    @Column('int', { name: 'percenteffort', nullable: true })
    percentEffort: number | null;

    @Column('varchar', {
        name: 'Access',
        nullable: true,
        length: 45,
        default: () => '\'private\'',
    })
    access: string;

    @Column('varchar', { name: 'defaultSettings', nullable: true, length: 250 })
    defaultSettings: string;

    @Column('varchar', { name: 'iconUrl', nullable: true, length: 150 })
    iconUrl: string;

    @Column('varchar', { name: 'headerUrl', nullable: true, length: 150 })
    headerUrl: string;

    @Column('int', { name: 'uid', nullable: true, unsigned: true })
    creatorUID: number | null;

    @Column('int', {
        name: 'SortSequence',
        unsigned: true,
        default: () => '\'50\'',
    })
    sortSequence: number;

    @Column('int', { name: 'expiration', nullable: true, unsigned: true })
    expiration: number | null;

    @Column('datetime', { name: 'DateLastModified', nullable: true })
    modifiedTimestamp: Date;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimeStamp: Date;

    @OneToMany(
        () => ChecklistChild,
        (fmchklstchildren) => fmchklstchildren.parent
    )
    children: Promise<ChecklistChild[]>;

    @OneToMany(() => ChecklistChild, (fmchklstchildren) => fmchklstchildren.cl)
    asChild: Promise<ChecklistChild[]>;

    @OneToMany(() => ChecklistTaxonLink, (fmchklsttaxalink) => fmchklsttaxalink.checklist)
    taxaLinks: Promise<ChecklistTaxonLink[]>;

    @OneToMany(
        () => ReferenceChecklistLink,
        (referencechecklistlink) => referencechecklistlink.checklist
    )
    referenceLinks: Promise<ReferenceChecklistLink[]>;

    @ManyToOne(() => User, (users) => users.checklists, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'uid', referencedColumnName: 'uid' }])
    user: Promise<User>;

    @OneToMany(() => ChecklistProjectLink, (fmchklstprojlink) => fmchklstprojlink.checklist)
    projectLinks: Promise<ChecklistProjectLink[]>;
}
