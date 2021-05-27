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
@Entity('geothesstateprovince')
export class GeoThesuarusStateProvince extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'gtspid' })
    id: number;

    @Column('varchar', { name: 'stateterm', length: 45 })
    stateTerm: string;

    @Column('varchar', { name: 'abbreviation', nullable: true, length: 45 })
    abbreviation: string | null;

    @Column('varchar', { name: 'code', nullable: true, length: 45 })
    code: string | null;

    @Column('int', { name: 'lookupterm', default: () => '\'1\'' })
    lookupTerm: number;

    @Column('int', { name: 'acceptedid', nullable: true })
    acceptedID: number | null;

    @Column('int', { name: 'countryid', nullable: true })
    countryID: number | null;

    @Column('longtext', { name: 'footprintWKT', nullable: true })
    footprintWKT: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
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
    @JoinColumn([{ name: 'acceptedid' }])
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
    @JoinColumn([{ name: 'countryid' }])
    country: Promise<GeoThesaurusCountry>;
}
