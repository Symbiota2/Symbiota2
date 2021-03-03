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
import { AdminLanguage } from '../AdminLanguage.entity';
import { Taxon } from './Taxon.entity';
import { EntityProvider } from '../../entity-provider.class';
import { User } from '../user/User.entity';

@Index('Index_unique', ['taxonID', 'displayLevel', 'language'], { unique: true })
@Index(['adminLanguageID'])
@Entity('taxadescrblock')
export class TaxonDescriptionBlock extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'tdbid', unsigned: true })
    id: number;

    @Column('int', { name: 'tid', unsigned: true })
    taxonID: number;

    @Column('varchar', { name: 'caption', nullable: true, length: 40 })
    caption: string;

    @Column('varchar', { name: 'source', nullable: true, length: 250 })
    source: string;

    @Column('varchar', { name: 'sourceurl', nullable: true, length: 250 })
    sourceUrl: string;

    @Column('varchar', {
        name: 'language',
        nullable: true,
        length: 45,
        default: () => '\'English\'',
    })
    language: string;

    @Column('int', { name: 'langid', nullable: true })
    adminLanguageID: number | null;

    @Column('int', {
        name: 'displaylevel',
        comment: '1 = short descr, 2 = intermediate descr',
        unsigned: true,
        default: () => '\'1\'',
    })
    displayLevel: number;

    @Column('int', { name: 'uid', unsigned: true })
    creatorUID: number;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(
        () => TaxonProfilePublicationDescriptionLink,
        (taxaprofilepubdesclink) => taxaprofilepubdesclink.descriptionBlock
    )
    publicDescriptionLinks: Promise<TaxonProfilePublicationDescriptionLink[]>;

    @OneToMany(() => TaxonDescriptionStatement, (taxadescrstmts) => taxadescrstmts.descriptionBlock)
    descriptionStatements: Promise<TaxonDescriptionStatement[]>;

    @ManyToOne(
        () => AdminLanguage,
        (adminlanguages) => adminlanguages.taxaDescBlocks,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
    )
    @JoinColumn([{ name: 'langid'}])
    adminLanguage: Promise<AdminLanguage>;

    @ManyToOne(
        () => User,
        (user) => user.taxonDescriptionBlocks,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
    )
    @JoinColumn([{ name: 'uid' }])
    creator: Promise<User>;

    @ManyToOne(() => Taxon, (taxa) => taxa.taxonDescriptionBlocks, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;
}
