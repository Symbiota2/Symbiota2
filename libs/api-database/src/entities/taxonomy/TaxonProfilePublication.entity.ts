import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TaxonProfilePublicationMapLink } from './TaxonProfilePublicationMapLink.entity';
import { TaxonProfilePublicationImageLink } from './TaxonProfilePublicationImageLink.entity';
import { User } from '../user/User.entity';
import { TaxonProfilePublicationDescriptionLink } from './TaxonProfilePublicationDescriptionLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['ownerUID'])
@Index('INDEX_taxaprofilepubs_title', ['title'])
@Entity('taxaprofilepubs')
export class TaxonProfilePublication extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'tppid' })
    id: number;

    @Column('varchar', { name: 'pubtitle', length: 150 })
    title: string;

    @Column('varchar', { name: 'authors', nullable: true, length: 150 })
    authors: string | null;

    @Column('varchar', { name: 'description', nullable: true, length: 500 })
    description: string | null;

    @Column('text', { name: 'abstract', nullable: true })
    abstract: string | null;

    @Column('int', { name: 'uidowner', nullable: true, unsigned: true })
    ownerUID: number | null;

    @Column('varchar', { name: 'externalurl', nullable: true, length: 250 })
    externalUrl: string | null;

    @Column('varchar', { name: 'rights', nullable: true, length: 250 })
    rights: string | null;

    @Column('varchar', { name: 'usageterm', nullable: true, length: 250 })
    usageTerm: string | null;

    @Column('varchar', { name: 'accessrights', nullable: true, length: 250 })
    accessRights: string | null;

    @Column('int', { name: 'ispublic', nullable: true })
    isPublic: number | null;

    @Column('int', { name: 'inclusive', nullable: true })
    inclusive: number | null;

    @Column('text', { name: 'dynamicProperties', nullable: true })
    dynamicProperties: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @OneToMany(
        () => TaxonProfilePublicationMapLink,
        (taxaprofilepubmaplink) => taxaprofilepubmaplink.publication
    )
    mapLinks: Promise<TaxonProfilePublicationMapLink[]>;

    @OneToMany(
        () => TaxonProfilePublicationImageLink,
        (taxaprofilepubimagelink) => taxaprofilepubimagelink.publication
    )
    imageLinks: Promise<TaxonProfilePublicationImageLink[]>;

    @ManyToOne(() => User, (users) => users.taxonProfilePublications, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uidowner', referencedColumnName: 'uid' }])
    owner: Promise<User>;

    @OneToMany(
        () => TaxonProfilePublicationDescriptionLink,
        (taxaprofilepubdesclink) => taxaprofilepubdesclink.publication
    )
    taxonDescriptionLinks: Promise<TaxonProfilePublicationDescriptionLink[]>;
}
