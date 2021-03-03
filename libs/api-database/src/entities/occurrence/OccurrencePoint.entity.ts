import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Index('occid', ['occurrenceID'], { unique: true })
@Index('point', ['point'], { spatial: true })
@Entity('omoccurpoints')
export class OccurrencePoint extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'geoID' })
    id: number;

    @Column('int', { name: 'occid', unique: true })
    occurrenceID: number;

    @Column('point', { name: 'point' })
    point: string;

    @Column('polygon', { name: 'errradiuspoly', nullable: true })
    errorRadiusPolygon: string | null;

    @Column('polygon', { name: 'footprintpoly', nullable: true })
    footprintPolygon: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;
}
