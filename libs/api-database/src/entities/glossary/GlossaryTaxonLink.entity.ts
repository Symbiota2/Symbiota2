import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Glossary } from './Glossary.entity';
import { Taxon } from '../taxonomy/Taxon.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('glossarytaxalink_ibfk_1', ['taxonID'])
@Entity('glossarytaxalink')
export class GlossaryTaxonLink extends EntityProvider {
    @Column('int', { primary: true, name: 'glossid', unsigned: true })
    glossaryID: number;

    @Column('int', { primary: true, name: 'tid', unsigned: true })
    taxonID: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Glossary, (glossary) => glossary.taxonLinks, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'glossid'}])
    glossary: Promise<Glossary>;

    @ManyToOne(() => Taxon, (taxa) => taxa.glossaryTaxonLinks, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;
}
