import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Taxon } from '../taxonomy/Taxon.entity';
import { EntityProvider } from '../../entity-provider.class';

@Entity('omoccurgeoindex')
export class OccurrenceGeoIndex extends EntityProvider {
    @Column('int', { primary: true, name: 'tid', unsigned: true })
    taxonID: number;

    @Column('double', { primary: true, name: 'decimallatitude', precision: 22 })
    latitude: number;

    @Column('double', {
        primary: true,
        name: 'decimallongitude',
        precision: 22
    })
    longitude: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Taxon, (taxa) => taxa.occurrenceGeoIndices, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;
}
