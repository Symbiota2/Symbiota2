import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { GeoThesaurusCounty } from './GeoThesaurusCounty.entity';
import { GeoThesaurusCountry } from './GeoThesaurusCountry.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['countryID'])
@Index(['acceptedID'])
@Entity()
export class GeoThesuarusStateProvince extends EntityProvider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 45 })
    stateTerm: string;

    @Column('varchar', { nullable: true, length: 45 })
    abbreviation: string | null;

    @Column('varchar', { nullable: true, length: 45 })
    code: string | null;

    @Column('int', { default: () => '\'1\'' })
    lookupTerm: number;

    @Column('int', { nullable: true })
    acceptedID: number | null;

    @Column('int', { nullable: true })
    countryID: number | null;

    @Column('longtext', { nullable: true })
    footprintWKT: string | null;

    @Column('timestamp', {
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @OneToMany(() => GeoThesaurusCounty, (geothescounty) => geothescounty.state)
    counties: Promise<GeoThesaurusCounty[]>;

    @ManyToOne(
        () => GeoThesuarusStateProvince,
        (geothesstateprovince) => geothesstateprovince.otherNames,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'acceptedID' }])
    acceptedName: Promise<GeoThesuarusStateProvince>;

    @OneToMany(
        () => GeoThesuarusStateProvince,
        (geothesstateprovince) => geothesstateprovince.acceptedName
    )
    otherNames: Promise<GeoThesuarusStateProvince[]>;

    @ManyToOne(
        () => GeoThesaurusCountry,
        (geothescountry) => geothescountry.stateProvinces,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'countryID' }])
    country: Promise<GeoThesaurusCountry>;
}
