import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CharacterState } from './CharacterState.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['characteristicID'])
@Index(['characteristicDependenceID'])
@Index(['characteristicDependenceID', 'characterStateDependence'])
@Entity('kmchardependence')
export class CharacteristicDependence extends EntityProvider {
    // TODO: Better composite key names
    @Column('int', { primary: true, name: 'CID', unsigned: true })
    characteristicID: number;

    @Column('int', { primary: true, name: 'CIDDependance', unsigned: true })
    characteristicDependenceID: number;

    @Column('varchar', { primary: true, name: 'CSDependance', length: 16 })
    characterStateDependence: string;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => CharacterState, (kmcs) => kmcs.characteristicDependencies, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    @JoinColumn([
        { name: 'CIDDependance', referencedColumnName: 'characteristicID'},
        { name: 'CSDependance', referencedColumnName: 'characterState' },
    ])
    characterState: Promise<CharacterState>;
}
