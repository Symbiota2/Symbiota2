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
@Entity()
export class GeoThesaurusCountry extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column('varchar', { length: 45 })
    countryTerm: string;

    @Column('varchar', { nullable: true, length: 45 })
    abbreviation: string | null;

    @Column('varchar', { nullable: true, length: 2 })
    iso: string | null;

    @Column('varchar', { nullable: true, length: 3 })
    iso3: string | null;

    @Column('int', { nullable: true })
    numCode: number | null;

    @Column('int', { default: () => "'1'" })
    lookupTerm: number;

    @Column('int', { nullable: true })
    acceptedID: number | null;

    @Column('int', { nullable: true })
    continentID: number | null;

    @Column('longtext', { nullable: true })
    footprintWKT: string | null;

    @Column('timestamp', {
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
    @JoinColumn([{ name: 'acceptedID' }])
    acceptedName: Promise<GeoThesaurusCountry>;

    @OneToMany(() => GeoThesaurusCountry, (geothescountry) => geothescountry.acceptedName)
    otherNames: Promise<GeoThesaurusCountry[]>;

    @ManyToOne(
        () => GeoThesaurusContinent,
        (geothescontinent) => geothescontinent.countries,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'continentID' }])
    continent: Promise<GeoThesaurusContinent>;
}
