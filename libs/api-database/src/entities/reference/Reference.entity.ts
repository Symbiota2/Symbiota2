import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ReferenceCollectionLink } from './ReferenceCollectionLink.entity';
import { ReferenceTaxonLink } from './ReferenceTaxonLink.entity';
import { OccurrenceType } from '../occurrence';
import { ReferenceType } from './ReferenceType.entity';
import { ReferenceAuthorLink } from './ReferenceAuthorLink.entity';
import { ReferenceChecklistTaxonLink } from './ReferenceChecklistTaxonLink.entity';
import { ReferenceChecklistLink } from './ReferenceChecklistLink.entity';
import { ReferenceOccurrenceLink } from './ReferenceOccurrenceLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('INDEX_refobj_title', ['title'])
@Index(['parentRefID'])
@Index(['referenceTypeID'])
@Entity('referenceobject')
export class Reference extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'refid' })
    id: number;

    @Column('int', { name: 'parentRefId', nullable: true })
    parentRefID: number | null;

    @Column('int', { name: 'ReferenceTypeId', nullable: true })
    referenceTypeID: number | null;

    @Column('varchar', { name: 'title', length: 150 })
    title: string;

    @Column('varchar', { name: 'secondarytitle', nullable: true, length: 250 })
    secondaryTitle: string;

    @Column('varchar', { name: 'shorttitle', nullable: true, length: 250 })
    shortTitle: string;

    @Column('varchar', { name: 'tertiarytitle', nullable: true, length: 250 })
    tertiaryTitle: string;

    @Column('varchar', {
        name: 'alternativetitle',
        nullable: true,
        length: 250
    })
    alternativeTitle: string;

    @Column('varchar', { name: 'typework', nullable: true, length: 150 })
    typeWork: string;

    @Column('varchar', { name: 'figures', nullable: true, length: 150 })
    figures: string;

    @Column('varchar', { name: 'pubdate', nullable: true, length: 45 })
    pubDate: string;

    @Column('varchar', { name: 'edition', nullable: true, length: 45 })
    edition: string;

    @Column('varchar', { name: 'volume', nullable: true, length: 45 })
    volume: string;

    @Column('varchar', { name: 'numbervolumnes', nullable: true, length: 45 })
    numberVolumes: string;

    @Column('varchar', { name: 'number', nullable: true, length: 45 })
    number: string;

    @Column('varchar', { name: 'pages', nullable: true, length: 45 })
    pages: string;

    @Column('varchar', { name: 'section', nullable: true, length: 45 })
    section: string;

    @Column('varchar', {
        name: 'placeofpublication',
        nullable: true,
        length: 45
    })
    placeOfPublication: string;

    @Column('varchar', { name: 'publisher', nullable: true, length: 150 })
    publisher: string;

    @Column('varchar', { name: 'isbn_issn', nullable: true, length: 45 })
    isbnIssn: string;

    @Column('varchar', { name: 'url', nullable: true, length: 150 })
    url: string;

    @Column('varchar', { name: 'guid', nullable: true, length: 45 })
    guid: string;

    @Column('varchar', { name: 'ispublished', nullable: true, length: 45 })
    isPublished: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 45 })
    notes: string;

    @Column('varchar', { name: 'cheatauthors', nullable: true, length: 250 })
    cheatAuthors: string;

    @Column('varchar', { name: 'cheatcitation', nullable: true, length: 250 })
    cheatCitation: string;

    @Column('int', { name: 'modifieduid', nullable: true, unsigned: true })
    lastModifiedUID: number | null;

    @Column('datetime', { name: 'modifiedtimestamp', nullable: true })
    lastModifiedTimestamp: Date | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(
        () => ReferenceCollectionLink,
        (referencecollectionlink) => referencecollectionlink.reference
    )
    collectionLinks: Promise<ReferenceCollectionLink[]>;

    @OneToMany(
        () => ReferenceTaxonLink,
        (referencetaxalink) => referencetaxalink.reference
    )
    taxonLinks: Promise<ReferenceTaxonLink[]>;

    @OneToMany(
        () => OccurrenceType,
        (omoccurrencetypes) => omoccurrencetypes.reference
    )
    occurrenceTypes: Promise<OccurrenceType[]>;

    @ManyToOne(
        () => Reference,
        (referenceobject) => referenceobject.childReferences,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'parentRefId'}])
    parentReference: Promise<Reference>;

    @OneToMany(
        () => Reference,
        (referenceobject) => referenceobject.parentReference
    )
    childReferences: Promise<Reference[]>;

    @ManyToOne(
        () => ReferenceType,
        (referencetype) => referencetype.references,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([
        { name: 'ReferenceTypeId'},
    ])
    referenceType: Promise<ReferenceType>;

    @OneToMany(
        () => ReferenceAuthorLink,
        (referenceauthorlink) => referenceauthorlink.reference
    )
    authorLinks: Promise<ReferenceAuthorLink[]>;

    @OneToMany(
        () => ReferenceChecklistTaxonLink,
        (referencechklsttaxalink) => referencechklsttaxalink.reference
    )
    checklistTaxonLinks: Promise<ReferenceChecklistTaxonLink[]>;

    @OneToMany(
        () => ReferenceChecklistLink,
        (referencechecklistlink) => referencechecklistlink.reference
    )
    checklistLinks: Promise<ReferenceChecklistLink[]>;

    @OneToMany(
        () => ReferenceOccurrenceLink,
        (referenceoccurlink) => referenceoccurlink.reference
    )
    occurrenceLinks: Promise<ReferenceOccurrenceLink[]>;
}
