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
@Entity()
export class GeoThesaurusCounty extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column('varchar', { length: 45 })
    countyTerm: string;

    @Column('varchar', { nullable: true, length: 45 })
    abbreviation: string | null;

    @Column('varchar', { nullable: true, length: 45 })
    code: string | null;

    @Column('int', { default: () => "'1'" })
    lookupTerm: number;

    @Column('int', { nullable: true })
    acceptedID: number | null;

    @Column('int', { nullable: true })
    stateID: number | null;

    @Column('text', { nullable: true })
    footprintWKT: string | null;

    @Column('timestamp', {
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(
        () => GeoThesaurusCounty,
        (geothescounty) => geothescounty.otherNames,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'acceptedID' }])
    acceptedName: Promise<GeoThesaurusCounty>;

    @OneToMany(() => GeoThesaurusCounty, (geothescounty) => geothescounty.acceptedName)
    otherNames: Promise<GeoThesaurusCounty[]>;

    @ManyToOne(
        () => GeoThesuarusStateProvince,
        (geothesstateprovince) => geothesstateprovince.counties,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'stateID' }])
    state: Promise<GeoThesuarusStateProvince>;

    @OneToMany(
        () => GeoThesaurusMunicipality,
        (geothesmunicipality) => geothesmunicipality.county
    )
    municipalities: Promise<GeoThesaurusMunicipality[]>;
}
