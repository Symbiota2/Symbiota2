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
import { GeoThesaurusMunicipality } from './GeoThesaurusMunicipality.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['stateID'])
@Index(['acceptedID'])
@Entity('geothescounty')
export class GeoThesaurusCounty extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'gtcoid' })
    id: number;

    @Column('varchar', { name: 'countyterm', length: 45 })
    countyTerm: string;

    @Column('varchar', { name: 'abbreviation', nullable: true, length: 45 })
    abbreviation: string | null;

    @Column('varchar', { name: 'code', nullable: true, length: 45 })
    code: string | null;

    @Column('int', { name: 'lookupterm', default: () => '\'1\'' })
    lookupTerm: number;

    @Column('int', { name: 'acceptedid', nullable: true })
    acceptedID: number | null;

    @Column('int', { name: 'stateid', nullable: true })
    stateID: number | null;

    @Column('text', { name: 'footprintWKT', nullable: true })
    footprintWKT: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(
        () => GeoThesaurusCounty,
        (geothescounty) => geothescounty.otherNames,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'acceptedid' }])
    acceptedName: Promise<GeoThesaurusCounty>;

    @OneToMany(() => GeoThesaurusCounty, (geothescounty) => geothescounty.acceptedName)
    otherNames: Promise<GeoThesaurusCounty[]>;

    @ManyToOne(
        () => GeoThesuarusStateProvince,
        (geothesstateprovince) => geothesstateprovince.counties,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'stateid' }])
    state: Promise<GeoThesuarusStateProvince>;

    @OneToMany(
        () => GeoThesaurusMunicipality,
        (geothesmunicipality) => geothesmunicipality.county
    )
    municipalities: Promise<GeoThesaurusMunicipality[]>;
}
