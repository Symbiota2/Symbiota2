import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { LookupStateProvince } from './LookupStateProvince.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('unique_municipality', ['stateID', 'name'], { unique: true })
@Index(['stateID'])
@Index('index_municipalityname', ['name'])
@Entity('lkupmunicipality')
export class LookupMunicipality extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'municipalityId' })
    id: number;

    @Column('int', { name: 'stateId' })
    stateID: number;

    @Column('varchar', { name: 'municipalityName', length: 100 })
    name: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => LookupStateProvince,
        (lkupstateprovince) => lkupstateprovince.municipalities,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'stateId'}])
    state: Promise<LookupStateProvince>;
}
