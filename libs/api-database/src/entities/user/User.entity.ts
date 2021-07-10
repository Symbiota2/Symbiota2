import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { EntityProvider } from '../../entity-provider.class';
import { Institution } from '../collection/Institution.entity';
import { Occurrence } from '../occurrence/Occurrence.entity';
import { RefreshToken } from './RefreshToken.entity';
import { Taxon } from '../taxonomy/Taxon.entity';
import { TaxonDescriptionBlock } from '../taxonomy/TaxonDescriptionBlock.entity';
import { TaxonProfilePublication } from '../taxonomy/TaxonProfilePublication.entity';
import { UserRole } from './UserRole.entity';

@Index(['email', 'lastName'], { unique: true })
@Index(['username', 'password'])
@Entity()
export class User extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    uid: number;

    @Column('varchar', { length: 45, unique: true })
    username: string;

    @Exclude()
    @Column('varchar')
    password: string;

    @Column('varchar', { nullable: true, length: 45 })
    firstName: string | null;

    @Column('varchar', { length: 45 })
    lastName: string;

    @Column('varchar', { nullable: true, length: 150 })
    title: string | null;

    @Column('varchar', { nullable: true, length: 200 })
    institution: string | null;

    @Column('varchar', { nullable: true, length: 200 })
    department: string | null;

    @Column('varchar', { nullable: true, length: 255 })
    address: string | null;

    @Column('varchar', { nullable: true, length: 100 })
    city: string | null;

    @Column('varchar', { nullable: true, length: 50 })
    state: string | null;

    @Column('varchar', { nullable: true, length: 15 })
    zip: string | null;

    @Column('varchar', { nullable: true, length: 50 })
    country: string | null;

    @Column('varchar', { nullable: true, length: 45 })
    phone: string | null;

    @Column('varchar', { length: 100 })
    email: string;

    @Column('varchar', { nullable: true, length: 45 })
    regionOfInterest: string | null;

    @Column('varchar', { nullable: true, length: 400 })
    url: string | null;

    @Column('varchar', { nullable: true, length: 1500 })
    biography: string | null;

    @Column('varchar', { nullable: true, length: 255 })
    notes: string | null;

    @Column('int', { unsigned: true, default: () => "'0'" })
    isPublic: number;

    @Column('varchar', { nullable: true, length: 250 })
    defaultRights: string | null;

    @Column('varchar', { nullable: true, length: 250 })
    rightsHolder: string | null;

    @Column('varchar', { nullable: true, length: 250 })
    rights: string | null;

    @Column('varchar', { nullable: true, length: 250 })
    accessRights: string | null;

    @Column('varchar', { nullable: true, length: 45 })
    guid: string | null;

    @Column('varchar', { length: 45, default: () => "'0'" })
    validated: string;

    @Column('varchar', { nullable: true, length: 100 })
    userGroups: string | null;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP()' })
    initialTimestamp: Date;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP()' })
    lastLogin: Date;

    @OneToMany(() => RefreshToken, (token) => token.uid)
    refreshToken: Promise<RefreshToken>;

    @OneToMany(() => UserRole, (userroles) => userroles.user)
    roles: Promise<UserRole[]>;

    @OneToMany(() => UserRole, (userroles) => userroles.assigner)
    assignedRoles: Promise<UserRole[]>;

    @OneToMany(
        () => TaxonProfilePublication,
        (taxaprofilepubs) => taxaprofilepubs.owner
    )
    taxonProfilePublications: Promise<TaxonProfilePublication[]>;

    @OneToMany(() => Occurrence, (omoccurrences) => omoccurrences.observer)
    observedOccurrences: Promise<Occurrence[]>;

    @OneToMany(() => Institution, (institutions) => institutions.lastModifiedUser)
    institutions: Promise<Institution[]>;

    @OneToMany(() => Taxon, (taxa) => taxa.lastModifiedUser)
    modifiedTaxa: Promise<Taxon[]>;

    @OneToMany(() => TaxonDescriptionBlock, (tdr) => tdr.creator)
    taxonDescriptionBlocks: Promise<TaxonDescriptionBlock[]>;
}
