import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Taxon } from './Taxon.entity';
import { TaxonomicAuthority } from './TaxonomicAuthority.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['taxonID'])
@Index(['taxonAuthorityID'])
@Index(['parentTaxonID'])
@Entity('taxaenumtree')
export class TaxaEnumTreeEntry extends EntityProvider {
    @Column('int', { primary: true, name: 'tid', unsigned: true })
    taxonID: number;

    @Column('int', { primary: true, name: 'taxauthid', unsigned: true })
    taxonAuthorityID: number;

    @Column('int', { primary: true, name: 'parenttid', unsigned: true })
    parentTaxonID: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Taxon, (taxa) => taxa.taxaEnumEntries, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;


    @ManyToOne(() => Taxon, (taxa) => taxa.childTaxaEnumEntries, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'parenttid'}])
    parentTaxon: Promise<Taxon>;

    @ManyToOne(() => TaxonomicAuthority, (taxauthority) => taxauthority.enumTreeEntries, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'taxauthid'}])
    taxonAuthority: Promise<TaxonomicAuthority>;
}
