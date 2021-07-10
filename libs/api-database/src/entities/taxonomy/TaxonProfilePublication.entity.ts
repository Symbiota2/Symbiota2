import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TaxonProfilePublicationImageLink } from './TaxonProfilePublicationImageLink.entity';
import { User } from '../user/User.entity';
import { TaxonProfilePublicationDescriptionLink } from './TaxonProfilePublicationDescriptionLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['ownerUID'])
@Index(['title'])
@Entity()
export class TaxonProfilePublication extends EntityProvider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 150 })
    title: string;

    @Column('varchar', { nullable: true, length: 150 })
    authors: string | null;

    @Column('varchar', { nullable: true, length: 500 })
    description: string | null;

    @Column('text', { nullable: true })
    abstract: string | null;

    @Column('int', { nullable: true, unsigned: true })
    ownerUID: number | null;

    @Column('varchar', { nullable: true, length: 250 })
    externalUrl: string | null;

    @Column('varchar', { nullable: true, length: 250 })
    rights: string | null;

    @Column('varchar', { nullable: true, length: 250 })
    usageTerm: string | null;

    @Column('varchar', { nullable: true, length: 250 })
    accessRights: string | null;

    @Column('int', { nullable: true })
    isPublic: number | null;

    @Column('int', { nullable: true })
    inclusive: number | null;

    @Column('text', { nullable: true })
    dynamicProperties: string | null;

    @Column('timestamp', {
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @OneToMany(
        () => TaxonProfilePublicationImageLink,
        (taxaprofilepubimagelink) => taxaprofilepubimagelink.publication
    )
    imageLinks: Promise<TaxonProfilePublicationImageLink[]>;

    @ManyToOne(() => User, (users) => users.taxonProfilePublications, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'ownerUID' })
    owner: Promise<User>;

    @OneToMany(
        () => TaxonProfilePublicationDescriptionLink,
        (taxaprofilepubdesclink) => taxaprofilepubdesclink.publication
    )
    taxonDescriptionLinks: Promise<TaxonProfilePublicationDescriptionLink[]>;
}
