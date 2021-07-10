import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Taxon } from './Taxon.entity';
import { TaxonomicAuthority } from './TaxonomicAuthority.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['taxonIDAccepted'])
@Index(['taxonAuthorityID'])
@Index(['family'])
@Index(['parentTaxonID'])
@Index(['hierarchyStr'])
@Entity()
export class TaxonomicStatus extends EntityProvider {
    @Column('int', { primary: true, unsigned: true })
    taxonID: number;

    @Column('int', { primary: true, unsigned: true })
    taxonIDAccepted: number;

    @Column('int', {
        primary: true,
        comment: 'taxon authority id',
        unsigned: true,
    })
    taxonAuthorityID: number;

    @Column('int', { nullable: true, unsigned: true })
    parentTaxonID: number | null;

    @Column('varchar', { nullable: true, length: 200 })
    hierarchyStr: string | null;

    @Column('varchar', { nullable: true, length: 50 })
    family: string | null;

    @Column('varchar', {
        nullable: true,
        length: 250,
    })
    unacceptabilityReason: string | null;

    @Column('varchar', { nullable: true, length: 250 })
    notes: string | null;

    @Column('int', {
        nullable: true,
        unsigned: true,
        default: () => '\'50\'',
    })
    sortSequence: number | null;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Taxon, (taxa) => taxa.childTaxonStatuses, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'parentTaxonID'}])
    parentTaxon: Promise<Taxon>;

    @ManyToOne(() => TaxonomicAuthority, (taxauthority) => taxauthority.taxonStatuses, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'taxonAuthorityID' }])
    authority: Promise<TaxonomicAuthority>;

    @ManyToOne(() => Taxon, (taxa) => taxa.taxonStatuses, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'taxonID' }])
    taxon: Promise<Taxon>;

    @ManyToOne(() => Taxon, (taxa) => taxa.acceptedTaxonStatuses, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'taxonIDAccepted' }])
    acceptedTaxon: Promise<Taxon>;
}
