import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { DynamicChecklist } from './DynamicChecklist.entity';
import { Taxon } from '../taxonomy/Taxon.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['taxonID'])
@Entity('fmdyncltaxalink')
export class DynamicChecklistTaxonLink extends EntityProvider {
    @Column('int', { primary: true, name: 'dynclid', unsigned: true })
    dynamicChecklistID: number;

    @Column('int', { primary: true, name: 'tid', unsigned: true })
    taxonID: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => DynamicChecklist,
        (fmdynamicchecklists) => fmdynamicchecklists.dynamicChecklistTaxonLink,
        { onDelete: 'CASCADE', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'dynclid'}])
    dynamicChecklist: Promise<DynamicChecklist>;

    @ManyToOne(() => Taxon, (taxa) => taxa.dynamicChecklistLinks, {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;
}
