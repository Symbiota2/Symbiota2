import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminLanguage } from '../AdminLanguage.entity';
import { Taxon } from './Taxon.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('unique-key', ['language', 'vernacularName', 'taxonID'], { unique: true })
@Index('tid1', ['taxonID'])
@Index('vernacularsnames', ['vernacularName'])
@Index(['adminLanguageID'])
@Entity('taxavernaculars')
export class TaxonVernacular extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'VID' })
    id: number;

    @Column('int', { name: 'TID', unsigned: true, default: () => '\'0\'' })
    taxonID: number;

    @Column('varchar', { name: 'VernacularName', length: 80 })
    vernacularName: string;

    @Column('varchar', {
        name: 'Language',
        length: 15,
        default: () => '\'English\'',
    })
    language: string;

    @Column('int', { name: 'langid', nullable: true })
    adminLanguageID: number | null;

    @Column('varchar', { name: 'Source', nullable: true, length: 50 })
    source: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('varchar', { name: 'username', nullable: true, length: 45 })
    username: string;

    @Column('int', {
        name: 'isupperterm',
        nullable: true,
        default: () => '\'0\''
    })
    isUpperTerm: number | null;

    @Column('int', {
        name: 'SortSequence',
        nullable: true,
        default: () => '\'50\'',
    })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => AdminLanguage,
        (adminlanguages) => adminlanguages.taxonVernaculars,
        { onDelete: 'SET NULL', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'langid'}])
    adminLanguage: Promise<AdminLanguage>;

    @ManyToOne(() => Taxon, (taxa) => taxa.vernacularNames, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'TID'}])
    taxon: Promise<Taxon>;
}
