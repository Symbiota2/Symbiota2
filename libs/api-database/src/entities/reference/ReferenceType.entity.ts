import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Reference } from './Reference.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('ReferenceType_UNIQUE', ['referenceType'], { unique: true })
@Entity('referencetype')
export class ReferenceType extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'ReferenceTypeId' })
    id: number;

    @Column('varchar', { name: 'ReferenceType', unique: true, length: 45 })
    referenceType: string;

    @Column('int', { name: 'IsParent', nullable: true })
    isParent: number | null;

    @Column('varchar', { name: 'Title', nullable: true, length: 45 })
    title: string | null;

    @Column('varchar', { name: 'SecondaryTitle', nullable: true, length: 45 })
    secondaryTitle: string | null;

    @Column('varchar', { name: 'PlacePublished', nullable: true, length: 45 })
    placePublished: string | null;

    @Column('varchar', { name: 'Publisher', nullable: true, length: 45 })
    publisher: string | null;

    @Column('varchar', { name: 'Volume', nullable: true, length: 45 })
    volume: string | null;

    @Column('varchar', { name: 'NumberVolumes', nullable: true, length: 45 })
    numberVolumes: string | null;

    @Column('varchar', { name: 'Number', nullable: true, length: 45 })
    number: string | null;

    @Column('varchar', { name: 'Pages', nullable: true, length: 45 })
    pages: string | null;

    @Column('varchar', { name: 'Section', nullable: true, length: 45 })
    section: string | null;

    @Column('varchar', { name: 'TertiaryTitle', nullable: true, length: 45 })
    tertiaryTitle: string | null;

    @Column('varchar', { name: 'Edition', nullable: true, length: 45 })
    edition: string | null;

    @Column('varchar', { name: 'Date', nullable: true, length: 45 })
    date: string | null;

    @Column('varchar', { name: 'TypeWork', nullable: true, length: 45 })
    typeWork: string | null;

    @Column('varchar', { name: 'ShortTitle', nullable: true, length: 45 })
    shortTitle: string | null;

    @Column('varchar', { name: 'AlternativeTitle', nullable: true, length: 45 })
    alternativeTitle: string | null;

    @Column('varchar', { name: 'ISBN_ISSN', nullable: true, length: 45 })
    isbnIssn: string | null;

    @Column('varchar', { name: 'Figures', nullable: true, length: 45 })
    figures: string | null;

    @Column('int', { name: 'addedByUid', nullable: true })
    createdByUID: number | null;

    @Column('timestamp', {
        name: 'initialTimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @OneToMany(
        () => Reference,
        (referenceobject) => referenceobject.referenceType
    )
    references: Promise<Reference[]>;
}
