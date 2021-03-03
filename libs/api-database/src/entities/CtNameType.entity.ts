import { Column, Entity } from 'typeorm';
import { EntityProvider } from '../entity-provider.class';

@Entity('ctnametypes')
export class CtNameType extends EntityProvider {
    @Column('varchar', { primary: true, name: 'type', length: 32 })
    type: string;
}
