import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Reference } from './Reference.entity';
import { Taxon } from '../taxonomy/Taxon.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['referenceID'])
@Index(['taxonID'])
@Entity('referencetaxalink')
export class ReferenceTaxonLink extends EntityProvider {
    @Column('int', { primary: true, name: 'refid' })
    referenceID: number;

    @Column('int', { primary: true, name: 'tid', unsigned: true })
    taxonID: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Reference,
        (referenceobject) => referenceobject.taxonLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'refid'}])
    reference: Promise<Reference>;

    @ManyToOne(() => Taxon, (taxa) => taxa.referenceTaxonLinks, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;
}
