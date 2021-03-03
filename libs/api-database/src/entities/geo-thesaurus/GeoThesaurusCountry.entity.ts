import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { GeoThesuarusStateProvince } from './GeoThesuarusStateProvince.entity';
import { GeoThesaurusContinent } from './GeoThesaurusContinent.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['continentID'])
@Index(['acceptedID'])
@Entity('geothescountry')
export class GeoThesaurusCountry extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'gtcid' })
    id: number;

    @Column('varchar', { name: 'countryterm', length: 45 })
    countryTerm: string;

    @Column('varchar', { name: 'abbreviation', nullable: true, length: 45 })
    abbreviation: string | null;

    @Column('varchar', { name: 'iso', nullable: true, length: 2 })
    iso: string | null;

    @Column('varchar', { name: 'iso3', nullable: true, length: 3 })
    iso3: string | null;

    @Column('int', { name: 'numcode', nullable: true })
    numCode: number | null;

    @Column('int', { name: 'lookupterm', default: () => '\'1\'' })
    lookupTerm: number;

    @Column('int', { name: 'acceptedid', nullable: true })
    acceptedID: number | null;

    @Column('int', { name: 'continentid', nullable: true })
    continentID: number | null;

    @Column('text', { name: 'footprintWKT', nullable: true })
    footprintWKT: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @OneToMany(
        () => GeoThesuarusStateProvince,
        (geothesstateprovince) => geothesstateprovince.country
    )
    stateProvinces: Promise<GeoThesuarusStateProvince[]>;

    @ManyToOne(
        () => GeoThesaurusCountry,
        (geothescountry) => geothescountry.otherNames,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'acceptedid' }])
    acceptedName: Promise<GeoThesaurusCountry>;

    @OneToMany(() => GeoThesaurusCountry, (geothescountry) => geothescountry.acceptedName)
    otherNames: Promise<GeoThesaurusCountry[]>;

    @ManyToOne(
        () => GeoThesaurusContinent,
        (geothescontinent) => geothescontinent.countries,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'continentid' }])
    continent: Promise<GeoThesaurusContinent>;
}
