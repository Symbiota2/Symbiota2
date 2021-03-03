import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Taxon } from '../taxonomy/Taxon.entity';
import { EntityProvider } from '../../entity-provider.class';

@Entity('glossarysources')
export class GlossarySource extends EntityProvider {
    @Column('int', { primary: true, name: 'tid', unsigned: true })
    taxonID: number;

    @Column('varchar', {
        name: 'contributorTerm',
        nullable: true,
        length: 1000
    })
    contributorTerm: string;

    @Column('varchar', {
        name: 'contributorImage',
        nullable: true,
        length: 1000
    })
    contributorImage: string;

    @Column('varchar', { name: 'translator', nullable: true, length: 1000 })
    translator: string;

    @Column('varchar', {
        name: 'additionalSources',
        nullable: true,
        length: 1000,
    })
    additionalSources: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToOne(() => Taxon, (taxa) => taxa.glossarySource, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;
}
