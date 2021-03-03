import { Column, Entity, OneToMany } from 'typeorm';
import { ActionRequest } from './ActionRequest.entity';
import { EntityProvider } from '../../entity-provider.class';

@Entity('actionrequesttype')
export class ActionRequestType extends EntityProvider {
    @Column('varchar', { primary: true, name: 'requesttype', length: 30 })
    typeName: string;

    @Column('varchar', { name: 'context', nullable: true, length: 255 })
    context: string;

    @Column('varchar', { name: 'description', nullable: true, length: 255 })
    description: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(() => ActionRequest, (actionrequest) => actionrequest.type)
    actionRequests: Promise<ActionRequest[]>;
}
