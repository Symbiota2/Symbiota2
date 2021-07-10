import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Taxon } from './Taxon.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['language', 'vernacularName', 'taxonID'], { unique: true })
@Index(['taxonID'])
@Index(['vernacularName'])
@Index(['adminLanguageID'])
@Entity()
export class TaxonVernacular extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column('int', { unsigned: true, default: () => "'0'" })
    taxonID: number;

    @Column('varchar', { length: 80 })
    vernacularName: string;

    @Column('varchar', { length: 15, default: () => "'English'" })
    language: string;

    @Column('int', { nullable: true })
    adminLanguageID: number | null;

    @Column('varchar', { nullable: true, length: 50 })
    source: string;

    @Column('varchar', { nullable: true, length: 250 })
    notes: string;

    @Column('varchar', { nullable: true, length: 45 })
    username: string;

    @Column('int', {
        nullable: true,
        default: () => "'0'"
    })
    isUpperTerm: number | null;

    @Column('int', {
        nullable: true,
        default: () => "'50'",
    })
    sortSequence: number | null;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Taxon, (taxa) => taxa.vernacularNames, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'taxonID' }])
    taxon: Promise<Taxon>;
}
