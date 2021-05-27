import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { GeoThesaurusCountry } from './GeoThesaurusCountry.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['acceptedID'])
@Entity('geothescontinent')
export class GeoThesaurusContinent extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'gtcid' })
    id: number;

    @Column('varchar', { name: 'continentterm', length: 45 })
    continentTerm: string;

    @Column('varchar', { name: 'abbreviation', nullable: true, length: 45 })
    abbreviation: string | null;

    @Column('varchar', { name: 'code', nullable: true, length: 45 })
    code: string | null;

    @Column('int', { name: 'lookupterm', default: () => '\'1\'' })
    lookupTerm: number;

    @Column('int', { name: 'acceptedid', nullable: true })
    acceptedID: number | null;

    @Column('longtext', { name: 'footprintWKT', nullable: true })
    footprintWKT: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @OneToMany(() => GeoThesaurusCountry, (geothescountry) => geothescountry.continent)
    countries: Promise<GeoThesaurusCountry[]>;

    @ManyToOne(
        () => GeoThesaurusContinent,
        (geothescontinent) => geothescontinent.otherNames,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'acceptedid' }])
    acceptedName: Promise<GeoThesaurusContinent>;

    @OneToMany(
        () => GeoThesaurusContinent,
        (geothescontinent) => geothescontinent.acceptedName
    )
    otherNames: Promise<GeoThesaurusContinent[]>;
}
