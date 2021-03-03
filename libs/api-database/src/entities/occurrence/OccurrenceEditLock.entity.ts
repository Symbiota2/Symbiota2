import { Column, Entity } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Entity('omoccureditlocks')
export class OccurrenceEditLock extends EntityProvider {
    @Column('int', { primary: true, name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('int', { name: 'uid' })
    uid: number;

    // TODO: Better name
    @Column('int', { name: 'ts' })
    ts: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;
}
