import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Taxon } from './Taxon.entity';
import { TaxonomicAuthority } from './TaxonomicAuthority.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['taxonIDAccepted'])
@Index(['taxonAuthorityID'])
@Index('Index_ts_family', ['family'])
@Index('Index_parenttid', ['parentTaxonID'])
@Index('Index_hierarchy', ['hierarchyStr'])
@Entity('taxstatus')
export class TaxonomicStatus extends EntityProvider {
    @Column('int', { primary: true, name: 'tid', unsigned: true })
    taxonID: number;

    @Column('int', { primary: true, name: 'tidaccepted', unsigned: true })
    taxonIDAccepted: number;

    @Column('int', {
        primary: true,
        name: 'taxauthid',
        comment: 'taxon authority id',
        unsigned: true,
    })
    taxonAuthorityID: number;

    @Column('int', { name: 'parenttid', nullable: true, unsigned: true })
    parentTaxonID: number | null;

    @Column('varchar', { name: 'hierarchystr', nullable: true, length: 200 })
    hierarchyStr: string | null;

    @Column('varchar', { name: 'family', nullable: true, length: 50 })
    family: string | null;

    @Column('varchar', {
        name: 'UnacceptabilityReason',
        nullable: true,
        length: 250,
    })
    unacceptabilityReason: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('int', {
        name: 'SortSequence',
        nullable: true,
        unsigned: true,
        default: () => '\'50\'',
    })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Taxon, (taxa) => taxa.childTaxonStatuses, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'parenttid'}])
    parentTaxon: Promise<Taxon>;

    @ManyToOne(() => TaxonomicAuthority, (taxauthority) => taxauthority.taxonStatuses, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'taxauthid'}])
    authority: Promise<TaxonomicAuthority>;

    @ManyToOne(() => Taxon, (taxa) => taxa.taxonStatuses, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;

    @ManyToOne(() => Taxon, (taxa) => taxa.acceptedTaxonStatuses, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'tidaccepted'}])
    acceptedTaxon: Promise<Taxon>;
}
