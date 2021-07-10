import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TaxonVernacular } from './TaxonVernacular.entity';
import { TaxonResourceLink } from './TaxonResourceLink.entity';
import { TaxonomicStatus } from './TaxonomicStatus.entity';
import { TaxaEnumTreeEntry } from './TaxaEnumTreeEntry.entity';
import { TaxonLink } from './TaxonLink.entity';
import { Occurrence } from '../occurrence/Occurrence.entity';
import { TaxonDescriptionBlock } from './TaxonDescriptionBlock.entity';
import { User } from '../user/User.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['scientificName', 'rankID', 'author'], { unique: true })
@Index(['rankID'])
@Index(['unitName1', 'unitName2'])
@Index(['initialTimestamp'])
@Index(['lastModifiedUID'])
@Index(['scientificName'])
@Entity('taxa')
export class Taxon extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column('varchar', { nullable: true, length: 45 })
    kingdomName: string;

    @Column('smallint', { nullable: true, unsigned: true })
    rankID: number | null;

    @Column('varchar', { length: 250 })
    scientificName: string;

    @Column('varchar', { nullable: true, length: 1 })
    unitInd1: string;

    @Column('varchar', { length: 50 })
    unitName1: string;

    @Column('varchar', { nullable: true, length: 1 })
    unitInd2: string;

    @Column('varchar', { nullable: true, length: 50 })
    unitName2: string;

    @Column('varchar', { nullable: true, length: 7 })
    unitInd3: string;

    @Column('varchar', { nullable: true, length: 35 })
    unitName3: string;

    @Column('varchar', { nullable: true, length: 100 })
    author: string;

    @Column('tinyint', { nullable: true, unsigned: true })
    phyloSortSequence: number | null;

    @Column('varchar', { nullable: true, length: 50 })
    status: string;

    @Column('varchar', { nullable: true, length: 250 })
    source: string;

    @Column('varchar', { nullable: true, length: 250 })
    notes: string;

    @Column('varchar', { nullable: true, length: 50 })
    hybrid: string;

    @Column('int', {
        comment: '0 = no security; 1 = hidden locality',
        unsigned: true,
        default: () => "'0'",
    })
    securityStatus: number;

    @Column('int', { nullable: true, unsigned: true })
    lastModifiedUID: number | null;

    @Column('datetime', { nullable: true, default: () => 'CURRENT_TIMESTAMP()' })
    lastModifiedTimestamp: Date | null;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(() => TaxonVernacular, (taxavernaculars) => taxavernaculars.taxon)
    vernacularNames: Promise<TaxonVernacular[]>;

    @OneToMany(
        () => TaxonResourceLink,
        (taxaresourcelinks) => taxaresourcelinks.taxon
    )
    resourceLinks: Promise<TaxonResourceLink[]>;

    @OneToMany(() => TaxonomicStatus, (taxstatus) => taxstatus.parentTaxon)
    childTaxonStatuses: Promise<TaxonomicStatus[]>;

    @OneToMany(() => TaxonomicStatus, (taxstatus) => taxstatus.taxon)
    taxonStatuses: Promise<TaxonomicStatus[]>;

    @OneToMany(() => TaxonomicStatus, (taxstatus) => taxstatus.acceptedTaxon)
    acceptedTaxonStatuses: Promise<TaxonomicStatus[]>;

    @OneToMany(() => TaxaEnumTreeEntry, (taxaenumtree) => taxaenumtree.taxon)
    taxaEnumEntries: Promise<TaxaEnumTreeEntry[]>;

    @OneToMany(() => TaxaEnumTreeEntry, (taxaenumtree) => taxaenumtree.parentTaxon)
    childTaxaEnumEntries: Promise<TaxaEnumTreeEntry[]>;

    @OneToMany(() => TaxonLink, (taxalinks) => taxalinks.taxon)
    taxonLinks: Promise<TaxonLink[]>;

    @OneToMany(
        () => Occurrence,
        (omoccurrences) => omoccurrences.taxon
    )
    occurrences: Promise<Occurrence[]>;

    @OneToMany(() => TaxonDescriptionBlock, (taxadescrblock) => taxadescrblock.taxon)
    taxonDescriptionBlocks: Promise<TaxonDescriptionBlock[]>;

    @ManyToOne(() => User, (users) => users.modifiedTaxa, {
        onDelete: 'NO ACTION',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'lastModifiedUID' }])
    lastModifiedUser: Promise<User>;
}
