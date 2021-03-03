import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Index('UNIQUE_sciname', ['scientificName', 'rankID', 'author'], { unique: true })
@Index('sourceID_index', ['sourceID'])
@Index('sourceAcceptedId_index', ['sourceAcceptedID'])
@Index('sciname_index', ['scientificName'])
@Index('scinameinput_index', ['scientificNameInput'])
@Index('parentStr_index', ['parentStr'])
@Index('acceptedStr_index', ['acceptedStr'])
@Index('unitname1_index', ['unitName1'])
@Index('sourceParentId_index', ['sourceParentID'])
@Index('acceptance_index', ['acceptance'])
@Entity('uploadtaxa')
export class TaxonUpload extends EntityProvider {
    @PrimaryGeneratedColumn({ name: 'id', unsigned: true })
    id: number;

    @Column('int', { name: 'TID', nullable: true, unsigned: true })
    taxonID: number | null;

    @Column('int', { name: 'SourceId', nullable: true, unsigned: true })
    sourceID: number | null;

    @Column('varchar', { name: 'Family', nullable: true, length: 50 })
    family: string;

    @Column('smallint', { name: 'RankId', nullable: true })
    rankID: number | null;

    @Column('varchar', { name: 'RankName', nullable: true, length: 45 })
    rankName: string;

    @Column('varchar', { name: 'scinameinput', length: 250 })
    scientificNameInput: string;

    @Column('varchar', { name: 'SciName', nullable: true, length: 250 })
    scientificName: string;

    // TODO: Better names
    @Column('varchar', { name: 'UnitInd1', nullable: true, length: 1 })
    unitInd1: string;

    @Column('varchar', { name: 'UnitName1', nullable: true, length: 50 })
    unitName1: string;

    @Column('varchar', { name: 'UnitInd2', nullable: true, length: 1 })
    unitInd2: string;

    @Column('varchar', { name: 'UnitName2', nullable: true, length: 50 })
    unitName2: string;

    @Column('varchar', { name: 'UnitInd3', nullable: true, length: 7 })
    unitInd3: string;

    @Column('varchar', { name: 'UnitName3', nullable: true, length: 35 })
    unitName3: string;

    @Column('varchar', { name: 'Author', nullable: true, length: 100 })
    author: string;

    @Column('varchar', { name: 'InfraAuthor', nullable: true, length: 100 })
    infraAuthor: string;

    @Column('int', {
        name: 'Acceptance',
        nullable: true,
        comment: '0 = not accepted; 1 = accepted',
        unsigned: true,
        default: () => '\'1\'',
    })
    acceptance: number | null;

    @Column('int', { name: 'TidAccepted', nullable: true, unsigned: true })
    acceptedTaxonID: number | null;

    @Column('varchar', { name: 'AcceptedStr', nullable: true, length: 250 })
    acceptedStr: string;

    @Column('int', { name: 'SourceAcceptedId', nullable: true, unsigned: true })
    sourceAcceptedID: number | null;

    @Column('varchar', {
        name: 'UnacceptabilityReason',
        nullable: true,
        length: 24,
    })
    unacceptabilityReason: string;

    @Column('int', { name: 'ParentTid', nullable: true })
    parentTaxonID: number | null;

    @Column('varchar', { name: 'ParentStr', nullable: true, length: 250 })
    parentStr: string;

    @Column('int', { name: 'SourceParentId', nullable: true, unsigned: true })
    sourceParentID: number | null;

    @Column('int', {
        name: 'SecurityStatus',
        comment: '0 = no security; 1 = hidden locality',
        unsigned: true,
        default: () => '\'0\'',
    })
    securityStatus: number;

    @Column('varchar', { name: 'Source', nullable: true, length: 250 })
    source: string;

    @Column('varchar', { name: 'Notes', nullable: true, length: 250 })
    notes: string;

    @Column('varchar', { name: 'vernacular', nullable: true, length: 250 })
    vernacular: string;

    @Column('varchar', { name: 'vernlang', nullable: true, length: 15 })
    vernacularLanguage: string;

    @Column('varchar', { name: 'Hybrid', nullable: true, length: 50 })
    hybrid: string;

    @Column('varchar', { name: 'ErrorStatus', nullable: true, length: 150 })
    errorStatus: string;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;
}
