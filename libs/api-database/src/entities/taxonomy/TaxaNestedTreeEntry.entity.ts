import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Taxon } from './Taxon.entity';
import { TaxonomicAuthority } from './TaxonomicAuthority.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('leftindex', ['leftIndex'])
@Index('rightindex', ['rightIndex'])
@Index(['taxonID'])
@Index(['taxonAuthorityID'])
@Entity('taxanestedtree')
export class TaxaNestedTreeEntry extends EntityProvider {
    @Column('int', { primary: true, name: 'tid', unsigned: true })
    taxonID: number;

    @Column('int', { primary: true, name: 'taxauthid', unsigned: true })
    taxonAuthorityID: number;

    @Column('int', { name: 'leftindex', unsigned: true })
    leftIndex: number;

    @Column('int', { name: 'rightindex', unsigned: true })
    rightIndex: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Taxon, (taxa) => taxa.nestedTaxonTrees, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;

    @ManyToOne(
        () => TaxonomicAuthority,
        (taxauthority) => taxauthority.nestedTreeEntries,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'taxauthid'}])
    taxonAuthority: Promise<TaxonomicAuthority>;
}
