import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Taxon } from '../taxonomy/Taxon.entity';
import { Trait } from './Trait.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['traitID'])
@Index(['taxonID'])
@Entity('tmtraittaxalink')
export class TraitTaxonLink extends EntityProvider {
    @Column('int', { primary: true, name: 'traitid', unsigned: true })
    traitID: number;

    @Column('int', { primary: true, name: 'tid', unsigned: true })
    taxonID: number;

    @Column('varchar', {
        name: 'relation',
        length: 45,
        default: () => '\'include\'',
    })
    relation: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Taxon, (taxa) => taxa.traitTaxonLinks, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;

    @ManyToOne(() => Trait, (tmtraits) => tmtraits.taxonLinks, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'traitid'}])
    trait: Promise<Trait>;
}
