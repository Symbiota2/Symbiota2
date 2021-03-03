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

@Index('unique_county', ['stateID', 'name'], { unique: true })
@Index(['stateID'])
@Index('index_countyname', ['name'])
@Entity('lkupcounty')
export class LookupCounty extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'countyId' })
    id: number;

    @Column('int', { name: 'stateId' })
    stateID: number;

    @Column('varchar', { name: 'countyName', length: 100 })
    name: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => LookupStateProvince,
        (lkupstateprovince) => lkupstateprovince.counties,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'stateId'}])
    state: Promise<LookupStateProvince>;
}
