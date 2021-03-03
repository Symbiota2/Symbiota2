import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { LookupStateProvince } from './LookupStateProvince.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('country_unique', ['name'], { unique: true })
@Index('Index_lkupcountry_iso', ['iso'])
@Index('Index_lkupcountry_iso3', ['iso3'])
@Entity('lkupcountry')
export class LookupCountry extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'countryId' })
    id: number;

    @Column('varchar', { name: 'countryName', unique: true, length: 100 })
    name: string;

    @Column('varchar', { name: 'iso', nullable: true, length: 2 })
    iso: string | null;

    @Column('varchar', { name: 'iso3', nullable: true, length: 3 })
    iso3: string | null;

    @Column('int', { name: 'numcode', nullable: true })
    numCode: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(
        () => LookupStateProvince,
        (lkupstateprovince) => lkupstateprovince.country
    )
    stateProvinces: Promise<LookupStateProvince[]>;
}
