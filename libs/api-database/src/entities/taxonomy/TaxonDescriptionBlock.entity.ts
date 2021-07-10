import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TaxonProfilePublicationDescriptionLink } from './TaxonProfilePublicationDescriptionLink.entity';
import { TaxonDescriptionStatement } from './TaxonDescriptionStatement.entity';
import { Taxon } from './Taxon.entity';
import { EntityProvider } from '../../entity-provider.class';
import { User } from '../user/User.entity';

@Index(['taxonID', 'displayLevel', 'language'], { unique: true })
@Index(['adminLanguageID'])
@Entity()
export class TaxonDescriptionBlock extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('int', { unsigned: true })
    taxonID: number;

    @Column('varchar', { nullable: true, length: 40 })
    caption: string;

    @Column('varchar', { nullable: true, length: 250 })
    source: string;

    @Column('varchar', { nullable: true, length: 250 })
    sourceUrl: string;

    @Column('varchar', {
        nullable: true,
        length: 45,
        default: () => '\'English\'',
    })
    language: string;

    @Column('int', { nullable: true })
    adminLanguageID: number | null;

    @Column('int', {
        comment: '1 = short descr, 2 = intermediate descr',
        unsigned: true,
        default: () => "'1'",
    })
    displayLevel: number;

    @Column('int', { unsigned: true })
    creatorUID: number;

    @Column('varchar', { nullable: true, length: 250 })
    notes: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP()' })
    initialTimestamp: Date;

    @OneToMany(
        () => TaxonProfilePublicationDescriptionLink,
        (taxaprofilepubdesclink) => taxaprofilepubdesclink.descriptionBlock
    )
    publicDescriptionLinks: Promise<TaxonProfilePublicationDescriptionLink[]>;

    @OneToMany(() => TaxonDescriptionStatement, (taxadescrstmts) => taxadescrstmts.descriptionBlock)
    descriptionStatements: Promise<TaxonDescriptionStatement[]>;

    @ManyToOne(
        () => User,
        (user) => user.taxonDescriptionBlocks,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
    )
    @JoinColumn([{ name: 'creatorUID' }])
    creator: Promise<User>;

    @ManyToOne(() => Taxon, (taxa) => taxa.taxonDescriptionBlocks, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'taxonID' }])
    taxon: Promise<Taxon>;
}
