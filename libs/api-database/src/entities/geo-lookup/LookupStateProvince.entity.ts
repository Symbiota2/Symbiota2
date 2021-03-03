import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { LookupCounty } from './LookupCounty.entity';
import { LookupCountry } from './LookupCountry.entity';
import { LookupMunicipality } from './LookupMunicipality.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('state_index', ['name', 'countryID'], { unique: true })
@Index(['countryID'])
@Index('index_statename', ['name'])
@Index('Index_lkupstate_abbr', ['abbreviation'])
@Entity('lkupstateprovince')
export class LookupStateProvince extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'stateId' })
    stateID: number;

    @Column('int', { name: 'countryId' })
    countryID: number;

    @Column('varchar', { name: 'stateName', length: 100 })
    name: string;

    @Column('varchar', { name: 'abbrev', nullable: true, length: 2 })
    abbreviation: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(() => LookupCounty, (lkupcounty) => lkupcounty.state)
    counties: Promise<LookupCounty[]>;

    @ManyToOne(
        () => LookupCountry,
        (lkupcountry) => lkupcountry.stateProvinces,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'countryId' }])
    country: Promise<LookupCountry>;

    @OneToMany(
        () => LookupMunicipality,
        (lkupmunicipality) => lkupmunicipality.state
    )
    municipalities: Promise<LookupMunicipality[]>;
}
