import {
    Column,
    Entity,
    getConnection,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Repository,
} from 'typeorm';
import { Unknown } from '../unknown-taxon';
import { TaxonMap } from './TaxonMap.entity';
import { Medium } from '../Medium.entity';
import { OccurrenceDetermination } from '../occurrence';
import { ReferenceTaxonLink } from '../reference';
import { Image } from '../image/Image.entity';
import { OccurrenceType } from '../occurrence';
import { TaxaNestedTreeEntry } from './TaxaNestedTreeEntry.entity';
import { TaxonVernacular } from './TaxonVernacular.entity';
import { DynamicChecklistTaxonLink } from '../checklist';
import { CharacteristicDescription } from '../characteristic';
import { GlossarySource } from '../glossary';
import { UserTaxonomy } from './UserTaxonomy.entity';
import { OccurrenceGeoIndex } from '../occurrence';
import { TaxonResourceLink } from './TaxonResourceLink.entity';
import { ChotomousKey } from '../ChotomousKey.entity';
import { TaxonomicStatus } from './TaxonomicStatus.entity';
import { GlossaryTaxonLink } from '../glossary';
import { TraitTaxonLink } from '../trait';
import { TaxaEnumTreeEntry } from './TaxaEnumTreeEntry.entity';
import { ChecklistTaxonLink } from '../checklist';
import { OccurrenceAssociation } from '../occurrence';
import { ImageAnnotation } from '../image';
import { TaxonLink } from './TaxonLink.entity';
import { Occurrence } from '../occurrence/Occurrence.entity';
import { TaxonDescriptionBlock } from './TaxonDescriptionBlock.entity';
import { User } from '../user/User.entity';
import { CharacteristicTaxonLink } from '../characteristic';
import { EntityProvider } from '../../entity-provider.class';
import {
    DWC_FIELD_TAXON_ACCEPTED_NAME_USAGE,
    DWC_FIELD_RECORD_DYNAMIC_PROPS,
    DWC_FIELD_TAXON_CLASS,
    DWC_FIELD_TAXON_FAMILY,
    DWC_FIELD_TAXON_GENUS,
    DWC_FIELD_TAXON_ID,
    DWC_FIELD_TAXON_KINGDOM,
    DWC_FIELD_TAXON_ORDER,
    DWC_FIELD_TAXON_PHYLUM,
    DWC_FIELD_TAXON_RANK,
    DWC_FIELD_TAXON_REMARKS,
    DWC_FIELD_TAXON_SCIENTIFIC_NAME,
    DWC_FIELD_TAXON_SCIENTIFIC_NAME_AUTHORSHIP,
    DWC_FIELD_TAXON_STATUS,
    DWC_TERM_TAXON,
    DwCField,
    DwCID,
    DwCRecord,
    dwcRecordType,
} from '@symbiota2/dwc';
import { TaxonomicUnit } from './TaxonomicUnit.entity';
import { KGProperty, KGType } from '@symbiota2/knowledgeGraph';

@DwCRecord(DWC_TERM_TAXON)
@KGType('taxon:Taxon')
@Index('sciname_unique', ['scientificName', 'rankID', 'author'], {
    unique: true,
})
@Index('rankid_index', ['rankID'])
@Index('idx_taxacreated', ['initialTimestamp'])
@Index(['lastModifiedUID'])
@Index('sciname_index', ['scientificName'])
@Entity('taxa')
export class Taxon extends EntityProvider {
    static get DWC_TYPE(): string {
        return dwcRecordType(Taxon);
    }

    @DwCID()
    @DwCField(DWC_FIELD_TAXON_ID)
    @PrimaryGeneratedColumn({ type: 'int', name: 'TID', unsigned: true })
    id: number;

    @KGProperty('biol:kingdom')
    @Column('varchar', { name: 'kingdomName', nullable: true, length: 45 })
    kingdomName: string;

    @Column('smallint', { name: 'RankId', nullable: true, unsigned: true })
    rankID: number | null;

    @DwCField(DWC_FIELD_TAXON_SCIENTIFIC_NAME)
    @KGProperty('dbpedia-owl:scientificName')
    @Column('varchar', { name: 'SciName', length: 250 })
    scientificName: string;

    get unitName1(): string {
        return this.scientificName.split(' ')[0];
    }

    get unitName2(): string {
        const parts = this.scientificName.split(' ');
        if (parts.length > 1) {
            return parts[1];
        }
        return parts[0];
    }

    get unitName3(): string {
        const parts = this.scientificName.split(' ');
        if (parts.length > 2) {
            return parts[2];
        }
        if (parts.length > 1) {
            return parts[1];
        }
        return parts[0];
    }

    @Column('varchar', { name: 'UnitInd1', nullable: true, length: 1 })
    unitInd1: string;

    @Column('varchar', { name: 'UnitInd2', nullable: true, length: 1 })
    unitInd2: string;

    @Column('varchar', { name: 'UnitInd3', nullable: true, length: 7 })
    unitInd3: string;

    @DwCField(DWC_FIELD_TAXON_SCIENTIFIC_NAME_AUTHORSHIP)
    @Column('varchar', { name: 'Author', nullable: true, length: 100 })
    author: string;

    @Column('tinyint', {
        name: 'PhyloSortSequence',
        nullable: true,
        unsigned: true,
    })
    phyloSortSequence: number | null;

    @DwCField(DWC_FIELD_TAXON_STATUS)
    @Column('varchar', { name: 'Status', nullable: true, length: 50 })
    status: string;

    @Column('varchar', { name: 'Source', nullable: true, length: 250 })
    source: string;

    @DwCField(DWC_FIELD_TAXON_REMARKS)
    @Column('text', { name: 'Notes', nullable: true })
    notes: string;

    @Column('varchar', { name: 'Hybrid', nullable: true, length: 50 })
    hybrid: string;

    @Column('int', {
        name: 'SecurityStatus',
        comment: '0 = no security; 1 = hidden locality',
        unsigned: true,
        default: () => "'0'",
    })
    securityStatus: number;

    @Column('int', { name: 'modifiedUid', nullable: true, unsigned: true })
    lastModifiedUID: number | null;

    @Column('datetime', { name: 'modifiedTimeStamp', nullable: true })
    lastModifiedTimestamp: Date | null;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @Column('simple-json', { nullable: true })
    @DwCField(DWC_FIELD_RECORD_DYNAMIC_PROPS)
    dynamicProperties: Record<string, unknown>;

    @OneToMany(() => Unknown, (unknowns) => unknowns.taxon)
    unknowns: Promise<Unknown[]>;

    @OneToMany(() => TaxonMap, (taxamaps) => taxamaps.taxon)
    taxonMaps: Promise<TaxonMap[]>;

    @OneToMany(() => Medium, (media) => media.taxon)
    media: Promise<Medium[]>;

    @OneToMany(
        () => OccurrenceDetermination,
        (omoccurdeterminations) => omoccurdeterminations.taxon
    )
    occurrenceDeterminations: Promise<OccurrenceDetermination[]>;

    @OneToMany(
        () => ReferenceTaxonLink,
        (referencetaxalink) => referencetaxalink.taxon
    )
    referenceTaxonLinks: Promise<ReferenceTaxonLink[]>;

    @OneToMany(() => Image, (images) => images.taxon)
    images: Promise<Image[]>;

    @OneToMany(
        () => OccurrenceType,
        (omoccurrencetypes) => omoccurrencetypes.interpretedTaxon
    )
    occurrenceTypes: Promise<OccurrenceType[]>;

    @OneToMany(
        () => TaxaNestedTreeEntry,
        (taxanestedtree) => taxanestedtree.taxon
    )
    nestedTaxonTrees: Promise<TaxaNestedTreeEntry[]>;

    @OneToMany(
        () => TaxonVernacular,
        (taxavernaculars) => taxavernaculars.taxon
    )
    vernacularNames: Promise<TaxonVernacular[]>;

    @OneToMany(
        () => DynamicChecklistTaxonLink,
        (fmdyncltaxalink) => fmdyncltaxalink.taxon
    )
    dynamicChecklistLinks: Promise<DynamicChecklistTaxonLink[]>;

    @OneToMany(() => CharacteristicDescription, (kmdescr) => kmdescr.taxon)
    characteristicDescriptions: Promise<CharacteristicDescription[]>;

    @OneToOne(() => GlossarySource, (glossarysources) => glossarysources.taxon)
    glossarySource: Promise<GlossarySource>;

    @OneToMany(() => UserTaxonomy, (usertaxonomy) => usertaxonomy.taxon)
    userTaxonomies: Promise<UserTaxonomy[]>;

    @OneToMany(
        () => OccurrenceGeoIndex,
        (omoccurgeoindex) => omoccurgeoindex.taxon
    )
    occurrenceGeoIndices: Promise<OccurrenceGeoIndex[]>;

    @OneToMany(
        () => TaxonResourceLink,
        (taxaresourcelinks) => taxaresourcelinks.taxon
    )
    resourceLinks: Promise<TaxonResourceLink[]>;

    @OneToMany(() => ChotomousKey, (chotomouskey) => chotomouskey.taxon)
    chotomousKeys: Promise<ChotomousKey[]>;

    @OneToMany(() => TaxonomicStatus, (taxstatus) => taxstatus.parentTaxon)
    childTaxonStatuses: Promise<TaxonomicStatus[]>;

    @OneToMany(() => TaxonomicStatus, (taxstatus) => taxstatus.taxon)
    taxonStatuses: Promise<TaxonomicStatus[]>;

    @OneToMany(() => TaxonomicStatus, (taxstatus) => taxstatus.acceptedTaxon)
    acceptedTaxonStatuses: Promise<TaxonomicStatus[]>;

    @OneToMany(
        () => GlossaryTaxonLink,
        (glossarytaxalink) => glossarytaxalink.taxon
    )
    glossaryTaxonLinks: Promise<GlossaryTaxonLink[]>;

    @OneToMany(() => TraitTaxonLink, (tmtraittaxalink) => tmtraittaxalink.taxon)
    traitTaxonLinks: Promise<TraitTaxonLink[]>;

    @OneToMany(() => TaxaEnumTreeEntry, (taxaenumtree) => taxaenumtree.taxon)
    taxaEnumEntries: Promise<TaxaEnumTreeEntry[]>;

    @OneToMany(
        () => TaxaEnumTreeEntry,
        (taxaenumtree) => taxaenumtree.parentTaxon
    )
    childTaxaEnumEntries: Promise<TaxaEnumTreeEntry[]>;

    @OneToMany(
        () => ChecklistTaxonLink,
        (fmchklsttaxalink) => fmchklsttaxalink.taxon
    )
    checklistLinks: Promise<ChecklistTaxonLink[]>;

    @OneToMany(
        () => OccurrenceAssociation,
        (omoccurassociations) => omoccurassociations.taxon
    )
    occurrenceAssociations: Promise<OccurrenceAssociation[]>;

    @OneToMany(
        () => ImageAnnotation,
        (imageannotations) => imageannotations.taxon
    )
    imageAnnotations: Promise<ImageAnnotation[]>;

    @OneToMany(() => TaxonLink, (taxalinks) => taxalinks.taxon)
    taxonLinks: Promise<TaxonLink[]>;

    @OneToMany(() => Occurrence, (omoccurrences) => omoccurrences.taxon)
    occurrences: Promise<Occurrence[]>;

    @OneToMany(
        () => TaxonDescriptionBlock,
        (taxadescrblock) => taxadescrblock.taxon
    )
    taxonDescriptionBlocks: Promise<TaxonDescriptionBlock[]>;

    @ManyToOne(() => User, (users) => users.modifiedTaxa, {
        onDelete: 'NO ACTION',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'modifiedUid', referencedColumnName: 'uid' }])
    lastModifiedUser: Promise<User>;

    @OneToMany(
        () => CharacteristicTaxonLink,
        (kmchartaxalink) => kmchartaxalink.taxon
    )
    characteristicLinks: Promise<CharacteristicTaxonLink[]>;

    async lookupAncestor(
        taxonRepo: Repository<Taxon>,
        rankID: number
    ): Promise<Taxon> {
        return await taxonRepo
            .createQueryBuilder('t')
            .select()
            .innerJoin(TaxaEnumTreeEntry, 'te', 't.id = te.parentTaxonID')
            .where('te.taxonID = :taxonID', { taxonID: this.id })
            .andWhere('t.rankID = :rankID', { rankID })
            .take(1)
            .getOne();
    }

    async setAncestor(
        taxaEnumRepo: Repository<TaxaEnumTreeEntry>,
        ancestor: Taxon
    ) {
        const oldAncestorLink = await taxaEnumRepo.findOne({
            relations: ['parentTaxon'],
            where: {
                taxonID: this.id,
                'parentTaxon.rankID': ancestor.rankID,
            },
        });
        console.log(JSON.stringify(oldAncestorLink));
    }

    private async ancestorSciName(ancestorRankName: string): Promise<string> {
        const db = getConnection();
        const taxonRepo = db.getRepository(Taxon);

        const ancestor = await taxonRepo
            .createQueryBuilder('pt')
            .select(['pt.scientificName'])
            .innerJoin(TaxaEnumTreeEntry, 'te', 'pt.id = te.parentTaxonID')
            .innerJoin(Taxon, 't', 'te.taxonID = t.id')
            .innerJoin(
                TaxonomicUnit,
                'parentRank',
                'pt.rankID = parentRank.rankID'
            )
            .where('t.id = :taxonID', { taxonID: this.id })
            .andWhere('LOWER(parentRank.rankName) = :rankName', {
                rankName: ancestorRankName.toLocaleLowerCase(),
            })
            .cache(30000)
            .groupBy('pt.scientificName')
            .getOne();

        if (!ancestor) {
            return null;
        }

        return ancestor.scientificName;
    }

    async getRank(): Promise<TaxonomicUnit> {
        const db = getConnection();
        const taxonUnitRepo = db.getRepository(TaxonomicUnit);
        return await taxonUnitRepo.findOne({
            kingdomName: this.kingdomName,
            rankID: this.rankID,
        });
    }

    async setRank(rankName: string): Promise<TaxonomicUnit> {
        const db = getConnection();
        const taxonUnitRepo = db.getRepository(TaxonomicUnit);
        const rank = await taxonUnitRepo.findOne({
            kingdomName: this.kingdomName,
            rankName: rankName,
        });
        if (!rank) {
            throw new Error(
                `Rank '${rankName}' not found in kingdom ${this.kingdomName}`
            );
        }
        this.rankID = rank.rankID;
        return rank;
    }

    @DwCField(DWC_FIELD_TAXON_RANK)
    async rankName(): Promise<string> {
        const rank = await this.getRank();
        if (!rank) {
            return null;
        }
        return rank.rankName;
    }

    @DwCField(DWC_FIELD_TAXON_KINGDOM)
    async kingdom(): Promise<string> {
        return await this.ancestorSciName('Kingdom');
    }

    @DwCField(DWC_FIELD_TAXON_PHYLUM)
    async phylum(): Promise<string> {
        return await this.ancestorSciName('Phylum');
    }

    @DwCField(DWC_FIELD_TAXON_CLASS)
    async class(): Promise<string> {
        return await this.ancestorSciName('Class');
    }

    @DwCField(DWC_FIELD_TAXON_ORDER)
    async order(): Promise<string> {
        return await this.ancestorSciName('Order');
    }

    @DwCField(DWC_FIELD_TAXON_FAMILY)
    async family(): Promise<string> {
        return await this.ancestorSciName('Family');
    }

    @DwCField(DWC_FIELD_TAXON_GENUS)
    async genus(): Promise<string> {
        return await this.ancestorSciName('Genus');
    }

    @DwCField(DWC_FIELD_TAXON_ACCEPTED_NAME_USAGE)
    async scientificNameAccepted(): Promise<string> {
        const db = getConnection();
        const taxonRepo = db.getRepository(Taxon);

        const acceptedTaxon = await taxonRepo
            .createQueryBuilder('t')
            .select(['acceptedTaxon.scientificName'])
            .innerJoin(TaxonomicStatus, 's', 's.taxonID = t.id')
            .innerJoin(
                Taxon,
                'acceptedTaxon',
                's.taxonIDAccepted = acceptedTaxon.id'
            )
            .where('t.id = :taxonID', { taxonID: this.id })
            .orderBy('s.sortSequence')
            .getOne();

        if (acceptedTaxon) {
            return acceptedTaxon.scientificName;
        }
        return null;
    }
}
