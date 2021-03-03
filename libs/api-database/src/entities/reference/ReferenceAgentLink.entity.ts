import { Column, Entity } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Entity('referenceagentlinks')
export class ReferenceAgentLink extends EntityProvider {
    @Column('int', { primary: true, name: 'refid' })
    referenceID: number;

    @Column('int', { primary: true, name: 'agentid' })
    agentID: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @Column('int', { name: 'createdbyid' })
    createdByID: number;
}
