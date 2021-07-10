import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Taxon } from './Taxon.entity';
import { TaxonomicAuthority } from './TaxonomicAuthority.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['taxonID'])
@Index(['taxonAuthorityID'])
@Index(['parentTaxonID'])
@Entity('taxa_enum_tree')
export class TaxaEnumTreeEntry extends EntityProvider {
    @Column('int', { primary: true, unsigned: true })
    taxonID: number;

    @Column('int', { primary: true, unsigned: true })
    taxonAuthorityID: number;

    @Column('int', { primary: true, unsigned: true })
    parentTaxonID: number;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP()' })
    initialTimestamp: Date;

    @ManyToOne(() => Taxon, (taxa) => taxa.taxaEnumEntries, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'taxonID'})
    taxon: Promise<Taxon>;

    @ManyToOne(() => Taxon, (taxa) => taxa.childTaxaEnumEntries, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'parentTaxonID'})
    parentTaxon: Promise<Taxon>;

    @ManyToOne(() => TaxonomicAuthority, (taxauthority) => taxauthority.enumTreeEntries, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'taxonAuthorityID'})
    taxonAuthority: Promise<TaxonomicAuthority>;
}
